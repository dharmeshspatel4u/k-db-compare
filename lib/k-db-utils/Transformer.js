const Schemas = require('./Schemas')

let cleanMySqlRecordset = (mySQLRecordSet) => {
  return JSON.parse(JSON.stringify(mySQLRecordSet))
}

let transformMySQLDataConfigtoJSONSchema = (mySQLRecordSet, connection) => {
  let schema = Schemas.getSchemaTemplate(connection)

  schema.conifgurationData = schema.conifgurationData.concat(JSON.parse(JSON.stringify(mySQLRecordSet)))

  return schema
}

let transformMySQLTablestoJSONSchema = (schema, mySQLRecordSet) => {
console.log(schema)
  mySQLRecordSet[0].map(current => {
    let tableNode = schema.tables.find((element) => {
      return element.name == current.table_name
    })

    if (tableNode == undefined) {
      let tableNode = { name: current.table_name, columns: [], indexes: [] }
      schema.tables.push(tableNode)
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
  return schema
}

let transformMySQLIndexestoJSONSchema = (schema, mySQLRecordSet) => {
  mySQLRecordSet[0].map(current => {
    let tableNode = schema.tables.find((element) => {
      return element.name == current.table_name
    })

    if (tableNode == undefined) {
      let tableNode = { name: current.table_name, columns: [], indexes: [] }
      schema.tables.push(tableNode)
    }

    if (tableNode) {
      tableNode.indexes.push(
        { 
          "indexName": current.index_name, 
          "columnNames": current.column_names,
          "collation": current.collation,
          "sub_part": current.sub_part,
          "packed": current.packed,
          "nullable": current.nullable,
          "indexType": current.index_type
        }
      )
    }
  })
  return schema
}

module.exports = {
  cleanMySqlRecordset,
  transformMySQLDataConfigtoJSONSchema,
  transformMySQLTablestoJSONSchema,
  transformMySQLIndexestoJSONSchema
}