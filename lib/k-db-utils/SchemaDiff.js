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

module.exports = {
  diff
}