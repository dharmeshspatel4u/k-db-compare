const KMySqlClient = require('./../k-db-clients/KMySqlClient')
const schemaUtils = require('../k-db-utils/SchemaUtils')

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

  async getFieldDefs(schema, excludeTables) {
    let sql = 'select table_name, column_name, data_type, character_maximum_length, character_octet_length, numeric_precision, numeric_scale, datetime_precision, character_set_name, collation_name, column_type, column_key, privileges, column_default, is_nullable from information_schema.columns where table_schema = ? and table_name not in (?)'
    //console.log(sql)
    return await this.KMySqlClient.query(sql, [schema, excludeTables])
  }
  async getSchema(schema) {
    let sql = "select table_name, column_name, data_type, character_maximum_length, character_octet_length, numeric_precision, numeric_scale, datetime_precision, character_set_name, collation_name, column_type, column_key, privileges, column_default, is_nullable" +
        " from information_schema.columns" +
        " where table_schema = ?"
    
    //console.log(sql)
    let res = await this.KMySqlClient.query(sql, [schema])
    let schemaJson = schemaUtils.getSchemaJson(res, this.KMySqlClient.connection)

    return schemaJson
  }
  
  async connect() {
    console.log('Connecting KMySqlClient...')
    return await this.KMySqlClient.connect()
  }
}

module.exports = KMySqlAdapter
