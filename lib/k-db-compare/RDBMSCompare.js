const AdapterFactory = require('./../k-db-adapters/AdapterFactory')
const SchemaDiff = require('./../k-db-utils/SchemaDiff')

let compare = async (source, target, options) => {
  let diffs = SchemaDiff.diffSchemas(source, target, options)
  if (diffs.differences.length <= 0) {
    console.log('Schemas are identical!')
  }
  return diffs
}

let getSchema = async (db, options) => {
  return await getAdapter(db).getSchema(db.connection.databaseName, options)
}

let getTables = async (db) => {
  return await getAdapter(db).getTables(db.connection.databaseName)
}

let getAdapter = (db) => {
  return AdapterFactory.getAdapter(db.adapterType, db.connection)
}

module.exports = {
  compare,
  getSchema,
  getTables
}