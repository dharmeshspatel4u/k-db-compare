const adapterFactory = require('./../k-db-adapters/AdapterFactory')
const schemaUtils = require('./../k-db-utils/SchemaUtils')


let compare = async (source, target, options) => {
  //let sourceTables = await getTables(source)
  //let sourceFieldDefs = await getFieldDefs(source, [''])
  let sourceSchema = await getSchema(source)
//console.log(sourceSchema.tables[0].columns)
  //let targetTables = await getTables(target)
  //let targetFieldDefs = await getFieldDefs(target, [''])
  let targetSchema = await getSchema(target)
//console.log(targetSchema.tables[0].columns)

let diffs = getSchemaDiffs(sourceSchema, targetSchema)
  if (diffs.differences.length > 0) {
    console.log(diffs)
  } else {
    console.log('Schemas are identical!')
  }

  return diffs
}

let getSchema = async (db) => {
  return await getAdapter(db).getSchema(db.connection.databaseName)
}

let getSchemaDiffs = (source, target) => {
  return schemaUtils.getSchemaDiffs(source, target)
}

let getTables = async (db) => {
  return await getAdapter(db).getTables(db.connection.databaseName)
}

let getFieldDefs = async (db, excludeTables) => {
  return await getAdapter(db).getFieldDefs(db.connection.databaseName, excludeTables)
}

let getAdapter = (db) => {
  return adapterFactory.getAdapter(db.adapterType, db.connection)
}

module.exports = {
  compare,
  getSchema,
  getTables,
  getFieldDefs
}