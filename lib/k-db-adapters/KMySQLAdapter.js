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

  async getSchema(schema, options) {
    let sql = "select table_name, column_name, data_type, character_maximum_length, character_octet_length, numeric_precision, numeric_scale, datetime_precision, character_set_name, collation_name, column_type, column_key, privileges, column_default, is_nullable" +
        " from information_schema.columns" +
        " where table_schema = ? and table_name not in (?)"
    
    //console.log(sql)
    let res = await this.KMySqlClient.query(sql, [schema, options.schemaOptions.excludeTables])
    let schemaJson = Transformer.transformMySQLDDLtoJSONSchema(res, this.KMySqlClient.connection)

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