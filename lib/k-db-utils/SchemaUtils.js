let getSchemaJson = (mySQLRecordSet, connection) => {
  let timestamp = new Date().toUTCString()
  let newJSON = { 
    createdOn: timestamp,
    connection: {
      institutionName: connection.institutionName,
      institutionUrlName: connection.institutionUrlName,
      databaseEnvironment: connection.databaseEnvironment,
      hostName: connection.hostName,
      databaseName: connection.databaseName
    },
    tables: [] 
  }

  mySQLRecordSet[0].map(current => {
    let tableNode = newJSON.tables.find((element) => {
      return element.name == current.table_name
    })

    if (tableNode == undefined) {
      let tableNode = { name: current.table_name, columns: [] }
      newJSON.tables.push(tableNode)
    }

    if (tableNode) {
      tableNode.columns.push(
        { 
          "columnName": current.column_name, 
          "dataType": current.data_type,
          "characterMaximumLength": current.character_maximum_length,
          "characterOctetLength": current.character_octet_length,
          "numericPrecision": current.numeric_precision,
          "numericScale": current.numeric_scale,
          "datetimePrecision": current.datetime_precision,
          "characterSetName": current.character_set_name,
          "collationName": current.collation_name,
          "columnType": current.column_type,
          "columnKey": current.column_key,
          "privileges": current.privileges,
          "columnDefault": current.column_default,
          "isNullable": current.is_nullable
        }
      )
    }
  })
  return newJSON
}

let getSchemaDiffs = (sourceSchema, targetSchema) => {
  let timestamp = new Date().toUTCString()
  let diffList = {
    schemasComparedOn: timestamp,
    source: {
      timestamp: sourceSchema.createdOn,
      connection: {
        institutionName: sourceSchema.connection.institutionName,
        institutionUrlName: sourceSchema.connection.institutionUrlName,
        databaseEnvironment: sourceSchema.connection.databaseEnvironment,
        hostName: sourceSchema.connection.hostName,
        databaseName: sourceSchema.connection.databaseName
      }
    },
    target: {
      timestamp: targetSchema.createdOn,
      connection: {
        institutionName: targetSchema.connection.institutionName,
        institutionUrlName: targetSchema.connection.institutionUrlName,
        databaseEnvironment: targetSchema.connection.databaseEnvironment,
        hostName: targetSchema.connection.hostName,
        databaseName: targetSchema.connection.databaseName
      }
    },
    differences: []
  }

  sourceSchema.tables.map((table) => {

    let targetTable = targetSchema.tables.find((element) => {
      return element.name == table.name
    })
    if (typeof targetTable == 'undefined') {
      diffList.differences.push({ sourceObj: table.name, targetObject: 'undefined' })
    } else {
      table.columns.map((currentColumn) => {
        //console.log(table.name)
        //console.log(currentColumn)
        let targetColumn = targetTable.columns.find((element) => {
          //console.log(`${element.columnName} : ${currentColumn.columnName}`)
          return element.columnName == currentColumn.columnName
        })

        if (typeof targetColumn == 'undefined') {
          diffList.differences.push({ sourceObject: table.name + '.' + currentColumn.columnName, targetObject: table.name + '.undefined' })
        } else {
          //console.log(`currentColumn:`)
          //console.log(currentColumn)
          //console.log(`targetColumn: `)
          //console.log(targetColumn)
          if (targetColumn) {
            //console.log(`${table.name} compareColumn ${targetColumn}`)
            let columnDiffs = getColumnDiffs(currentColumn, targetColumn)
            if (columnDiffs.length > 0) {
              diffList.push(columnDiffs)
            }
          }
        }
      })  
    }
  })
  return diffList
}

let getColumnDiffs = (source, target) => {
  let columnDiffs = []
  for (let prop in source) {
    if (typeof target[prop] == 'undefined') {
      columnDiffs.push({ sourceObject: source.columnName + '.' + prop + '.' + source[prop], targetObject: source.columnName + '.' + prop + '.undefined' })
    } else {
      if (source[prop] != target[prop]) {
        columnDiffs.push({ sourceObject: source.columnName + '.' + prop + '.' + source[prop], targetObject: source.columnName + '.' + prop + '.' + target[prop] })
      }
    }
  }
  return columnDiffs
}

module.exports = {
  getSchemaJson,
  getSchemaDiffs,
  getColumnDiffs
}