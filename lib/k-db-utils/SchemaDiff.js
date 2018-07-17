const Schemas = require('./../k-db-utils/Schemas')

let diff = (sourceSchema, targetSchema) => {
  let diffList = Schemas.getSchemaCompareTemplate(sourceSchema, targetSchema)
  let structureDiffs = getStructureDiffs(sourceSchema, targetSchema)
  diffList.differences = diffList.differences.concat(structureDiffs)

  return diffList
}

let getStructureDiffs = (sourceSchema, targetSchema) => {
  let tableDiffs = []
  sourceSchema.tables.map((table) => {
    let targetTable = getTable(targetSchema, table.name)
    if (typeof targetTable == 'undefined') {
      tableDiffs.push({ comparisonType: 'table', sourceObj: sourceSchema.connection.databaseName + '.' + table.name, targetObject: targetSchema.connection.databaseName + '.undefined' })
    } else {
      table.columns.map((currentColumn) => {
        let targetColumn = getColumn(targetTable, currentColumn.columnName)
        let columnDiffs = getColumnDiffs(table.name, currentColumn, targetColumn)
        tableDiffs = tableDiffs.concat(columnDiffs)
      })  

      table.indexes.map((currentIndex) => {
        let targetIndex = getIndex(targetTable, currentIndex.indexName)
        if (typeof targetIndex == 'undefined') {
          tableDiffs.push({ comparisonType: 'index-def', sourceObject: table.name + '.' + currentIndex.indexName, targetObject: table.name + '.' + currentIndex.indexName + '.undefined' })
        } else {
          let indexDiffs = getIndexDiffs(table.name, currentIndex, targetIndex)
          tableDiffs = tableDiffs.concat(indexDiffs)
        }
      })  
    }
  })
  return tableDiffs
}

let getColumnDiffs = (tableName, source, target) => {
  let columnDiffs = []
  for (let prop in source) {
    if (typeof target[prop] == 'undefined') {
      columnDiffs.push({ comparisonType: 'column-def', sourceObject: tableName + '.' + source.columnName + '.' + prop + '.' + source[prop], targetObject: tableName + '.' + source.columnName + '.' + prop + '.undefined' })
    } else {
      if (source[prop] != target[prop]) {
        columnDiffs.push({ comparisonType: 'column-def', sourceObject: tableName + '.' + source.columnName + '.' + prop + '.' + source[prop], targetObject: tableName + '.' + source.columnName + '.' + prop + '.' + target[prop] })
      }
    }
  }
  return columnDiffs
}

let getIndexDiffs = (tableName, source, target) => {
  let indexDiffs = []
  for (let prop in source) {
    if (typeof target[prop] == 'undefined') {
      indexDiffs.push({ comparisonType: 'index-def', sourceObject: tableName + '.' + source.indexName + '.' + prop + '.' + source[prop], targetObject: tableName + '.' + source.indexName + '.' + prop + '.undefined' })
    } else {
      if (source[prop] != target[prop]) {
        indexDiffs.push({ comparisonType: 'index-def', sourceObject: tableName + '.' + source.indexName + '.' + prop + '.' + source[prop], targetObject: tableName + '.' + source.indexName + '.' + prop + '.' + target[prop] })
      }
    }
  }
  return indexDiffs
}

let getTable = (schema, tableName) => {
  let table = schema.tables.find((element) => {
    return element.name == tableName
  })
  return table
}

let getColumn = (table, columnName) => {
  let column = table.columns.find((element) => {
    return element.columnName == columnName
  })
  return column
}

let getIndex = (table, indexName) => {
  let index = table.indexes.find((element) => {
    return element.indexName == indexName
  })
  return index
}

module.exports = {
  diff
}