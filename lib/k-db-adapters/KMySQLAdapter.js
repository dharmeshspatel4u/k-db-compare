const KMySqlClient = require('./../k-db-clients/KMySqlClient')
const Transformer = require('./../k-db-utils/Transformer')
const Schemas = require('./../k-db-utils/Schemas')

class KMySqlAdapter {
  constructor(connection) {
    this.KMySqlClient = new KMySqlClient(connection)
  }

  async query(queryObj) {
    return await this.KMySqlClient.query(queryObj.queryString)
  }

  async getTables(schema) {
    return await this.KMySqlClient.query("select table_name from information_schema.tables where table_schema = ?", [schema])
  }

  async getForeignKeys(schema) {
    let keys = await this.KMySqlClient.query("SELECT constraint_schema as constraintSchema, constraint_name as constraintName, " +
      " table_name as tableName, group_concat(column_name) as columnNames, referenced_table_name as referencedTableName, " +
      " group_concat(referenced_column_name) as referencedColumnNames " +
      " FROM information_schema.KEY_COLUMN_USAGE " + 
      " WHERE `CONSTRAINT_SCHEMA` LIKE ? " +
      " and referenced_table_schema is not null" +
      " group by constraint_schema, constraint_name, tableName, referenced_table_name", [schema])

    return JSON.parse(JSON.stringify(keys[0]))
  }

  buildIntegritySql(key) {
    let columnNames = key.columnNames.split(',')
    let referencedColumnNames = key.referencedColumnNames.split(',')
    let sql = "SELECT count(1) as orphanedCount" + 
      " FROM " + key.tableName + " as REFERRING " +
      " LEFT JOIN " + key.referencedTableName + " as REFERRED ON ("

    for (let i = 0; i<columnNames.length; i++) {
      sql = sql + " REFERRING." + columnNames[i] + " = REFERRED." + referencedColumnNames[i]
      if (i+1 < columnNames.length) {
        sql = sql + " AND "
      }
    }

    sql = sql + ") WHERE "
    
    for (let i = 0; i<columnNames.length; i++) {
      sql = sql + "(REFERRING." + columnNames[i] + " IS NOT NULL AND REFERRED." + referencedColumnNames[i] + " IS NULL)"
      if (i+1 < columnNames.length) {
        sql = sql + " AND "
      }
    }
    sql = sql + " limit 1"

    return sql
  }

  async isReferentialValid(key) {
    try {
      let sql = this.buildIntegritySql(key)
      let results = await this.KMySqlClient.query(sql, [])

      if (results[0][0].orphanedCount > 0) {
        console.log(sql)
        return false
      } else {
        return true
      }
    } catch (err) {
      console.log(err)
      return false
    } finally {
      return false
    }
  }
  
  async getColumnDefs(schema, options) {
    let sql = "select table_name, column_name, data_type, character_maximum_length, character_octet_length, numeric_precision, numeric_scale, datetime_precision, character_set_name, collation_name, column_type, column_key, privileges, column_default, is_nullable" +
        " from information_schema.columns" +
        " where table_schema = ? and table_name not in (?)"
    
    let res = await this.KMySqlClient.query(sql, [schema, options.schemaOptions.excludeTables])

    return res
  }

  async getIndexDefs(schema, options) {
    let sql = "select table_schema, table_name, index_name, group_concat(column_name) as column_names, collation, cardinality, sub_part, packed, nullable, index_type" +
      " from information_schema.statistics" +
      " where table_schema = ?" +
      "   and table_name not in (?)" +
      " group by table_schema, table_name, index_name, collation, cardinality, sub_part, packed, nullable, index_type"
    
    //console.log(sql)
    let res = await this.KMySqlClient.query(sql, [schema, options.schemaOptions.excludeTables])

    return res
  }

  async getSchema(schema, options) {
    let schemaTemplate = Schemas.getSchemaTemplate(this.KMySqlClient.connection)
    console.log(schemaTemplate)
    let schemaJson = Transformer.transformMySQLTablestoJSONSchema(schemaTemplate, await this.getColumnDefs(schema, options))
    schemaJson = Transformer.transformMySQLIndexestoJSONSchema(schemaTemplate, await this.getIndexDefs(schema, options))

    return schemaJson
  }
  
  async getDataConfig(schema, options) {
    let dataConfigJson = Schemas.getSchemaTemplate(this.KMySqlClient.connection)

    for (let i=0; i<options.dataConfigOptions.queries.length; i++) {
      let res = await this.KMySqlClient.query(options.dataConfigOptions.queries[i].query)

      let data = Transformer.cleanMySqlRecordset(res[0])
      let dataConfigs = { name: options.dataConfigOptions.queries[i].configName, query: options.dataConfigOptions.queries[i].query, data: data }
      dataConfigJson.configurationData = dataConfigJson.configurationData.concat(dataConfigs)
    }

    return dataConfigJson
  }

  async connect() {
    //console.log('Connecting KMySqlClient...')
    return await this.KMySqlClient.connect()
  }
}

module.exports = KMySqlAdapter