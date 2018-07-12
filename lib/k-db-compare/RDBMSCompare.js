const AdapterFactory = require('./../k-db-adapters/AdapterFactory')
const SchemaDiff = require('./../k-db-utils/SchemaDiff')
const DataConfigDiff = require('./../k-db-utils/DataConfigDiff')

let compareSchema = async (source, target, options) => {
  let diffs = SchemaDiff.diff(source, target, options)
  return diffs
}

let compareDataConfig = async (source, target, options) => {
  let diffs = DataConfigDiff.diff(source, target, options)
  return diffs
}

let getSchema = async (db, options) => {
  return await getAdapter(db).getSchema(db.connection.databaseName, options)
}

let getDataConfig = async (db, options) => {
  let adapter = getAdapter(db)
  //console.log(adapter)
  return await adapter.getDataConfig(db.connection.databaseName, options)
}

let getAdapter = (db) => {
  return AdapterFactory.getAdapter(db.adapterType, db.connection)
}

module.exports = {
  compareSchema,
  compareDataConfig,
  getSchema,
  getDataConfig
}