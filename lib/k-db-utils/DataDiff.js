const Schemas = require('./../k-db-utils/Schemas')

let diffData = (sourceSchema, targetSchema) => {
  let diffList = Schemas.getSchemaCompareTemplate(sourceSchema, targetSchema)
  let dataDiffs = getDataDiffs(sourceSchema, targetSchema)
  diffList.differences = diffList.differences.concat(dataDiffs)

  return diffList
}

module.exports = {
  diffData
}