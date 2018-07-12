const Schemas = require('./../k-db-utils/Schemas')

let diff = (sourceSchema, targetSchema, query) => {

  let dataDiffs = getDataConfigDiffs(sourceSchema, targetSchema, query)

  return dataDiffs
}

let getDataConfigDiffs = (sourceSchema, targetSchema, query) => {
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
        
        if (typeof currentDataPoint[query.keyColumn] == 'undefined') {
          throw `Unable to find keyColumn: ${query.keyColumn} in dataset, query must have a column matching defined keyColumn`
        }

        let targetDataPoint = getDataPoint(targetDataQuery, currentDataPoint[query.keyColumn])
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

