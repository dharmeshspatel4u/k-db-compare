const KMySqlClient = require('./../k-db-clients/KMySqlClient')
const Transformer = require('./../k-db-utils/Transformer')

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

  async getSchema(schema, options) {
    let sql = "select table_name, column_name, data_type, character_maximum_length, character_octet_length, numeric_precision, numeric_scale, datetime_precision, character_set_name, collation_name, column_type, column_key, privileges, column_default, is_nullable" +
        " from information_schema.columns" +
        " where table_schema = ? and table_name not in (?)"
    
    //console.log(sql)
    let res = await this.KMySqlClient.query(sql, [schema, options.schemaOptions.excludeTables])
    let schemaJson = Transformer.transformMySQLDDLtoJSONSchema(res, this.KMySqlClient.connection)

    return schemaJson
  }
  
  async connect() {
    //console.log('Connecting KMySqlClient...')
    return await this.KMySqlClient.connect()
  }
}

module.exports = KMySqlAdapter
