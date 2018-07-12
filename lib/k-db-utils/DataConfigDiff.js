const Schemas = require('./../k-db-utils/Schemas')

let diff = (sourceSchema, targetSchema) => {
//console.log(sourceSchema)
  let diffList = Schemas.getSchemaCompareTemplate(sourceSchema, targetSchema)
  let dataDiffs = getDataConfigDiffs(sourceSchema, targetSchema)
  diffList.differences = diffList.differences.concat(dataDiffs)

  return diffList
}

let getDataConfigDiffs = (sourceSchema, targetSchema) => {
  let dataConfigDiffs = []

  sourceSchema.configurationData.map((sourceDataQuery) => {
    //console.log(dataQuery)
    let targetDataQuery = getDataQuery(targetSchema, sourceDataQuery.name)
    //console.log(targetDataQuery)
    if (typeof targetDataQuery == 'undefined') {
      dataConfigDiffs.push({ comparisonType: 'dataConfig', sourceObj: sourceSchema.connection.databaseName + '.' + sourceDataQuery.name, targetObject: targetSchema.connection.databaseName + '.undefined' })
    } else {
      sourceDataQuery.data.map((currentDataPoint) => {
        //console.log(currentDataPoint)
        
        if (typeof currentDataPoint.dataKey == 'undefined') {
          throw "Datapoint must define a 'dataKey' property"
        }

        let targetDataPoint = getDataPoint(targetDataQuery, currentDataPoint.dataKey)
        //console.log(targetDataPoint)

        if (typeof targetDataPoint == 'undefined') {
          dataConfigDiffs.push({ comparisonType: 'data-config-item', sourceObject: sourceSchema.connection.databaseName + '.' + sourceDataQuery.name + '.' + currentDataPoint.dataKey, targetObject: targetSchema.connection.databaseName + '.' + sourceDataQuery.name + '.undefined' })
        } else {
          let dataPointDiffs = getDataPointDiffs(sourceDataQuery.name, currentDataPoint, targetDataPoint)
          dataConfigDiffs = dataConfigDiffs.concat(dataPointDiffs)
        }
      })  
    }
  })
  return dataConfigDiffs
}

let getDataPointDiffs = (configName, source, target) => {
  let dataPointDiffs = []
  for (let prop in source) {
    if (typeof target == 'undefined' || typeof target[prop] == 'undefined') {
      dataPointDiffs.push({ comparisonType: 'data-config-item', sourceObject: configName + '.' + prop + '.' + source[prop], targetObject: configName + '.' + prop + '.undefined' })
    } else {
      if (source[prop] != target[prop]) {
        dataPointDiffs.push({ comparisonType: 'data-config-item', sourceObject: configName + '.' + prop + '.' + source[prop], targetObject: configName + '.' + prop + '.' + target[prop] })
      }
    }
  }
  //console.log(dataPointDiffs)
  return dataPointDiffs
}

let getDataQuery = (schema, dataQueryName) => {
  let dataQuery = schema.configurationData.find((element) => {
    return element.name == dataQueryName
  })
  return dataQuery
}

let getDataPoint = (dataQuery, dataPointKey) => {
  let dataPoint = dataQuery.data.find((element) => {
    return element.dataKey == dataPointKey
  })
  return dataPoint
}

module.exports = {
  diff
}

