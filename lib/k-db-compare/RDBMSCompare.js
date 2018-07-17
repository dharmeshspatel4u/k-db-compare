const AdapterFactory = require('./../k-db-adapters/AdapterFactory')
const SchemaDiff = require('./../k-db-utils/SchemaDiff')
const DataConfigDiff = require('./../k-db-utils/DataConfigDiff')
const Schemas = require('./../k-db-utils/Schemas')

let compareSchema = async (source, target) => {
  let diffs = SchemaDiff.diff(source, target)
  return diffs
}

let compareDataConfig = async (source, target, options) => {
  let diffs = Schemas.getSchemaCompareTemplate(source, target)

  for (let i=0; i<options.dataConfigOptions.queries.length; i++) {
    let dataDiffs = DataConfigDiff.diff(source, target, options.dataConfigOptions.queries[i])
    diffs.differences = diffs.differences.concat(dataDiffs)
  }
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

let validateIntegrity = async(db, options) => {
  let results = []
  let adapter = getAdapter(db)
  let keys = await adapter.getForeignKeys(db.connection.databaseName)
  console.log(`Constraint count ${keys.length}`)
  for (let i=0; i<keys.length; i++) {
    console.log(`Checking constraint ${i+1} of ${keys.length} - ${keys[i].constraintName}`)
    let isValid = await adapter.isReferentialValid(keys[i])
    if (!isValid) {
      console.log("Constraint INVALID")
      console.log(keys[0])
      results.push({ checkType: 'referential-integrity', sourceObject: db.connection.databaseName + '.' + keys[i].constraintName })
    }
  }
  return results
}

let getAdapter = (db) => {
  return AdapterFactory.getAdapter(db.adapterType, db.connection)
}

module.exports = {
  compareSchema,
  compareDataConfig,
  getSchema,
  validateIntegrity,
  getDataConfig
}