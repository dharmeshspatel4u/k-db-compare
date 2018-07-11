const Schemas = require('./Schemas')

let transformMySQLDDLtoJSONSchema = (mySQLRecordSet, connection) => {
  let schema = Schemas.getSchemaTemplate(connection)

  mySQLRecordSet[0].map(current => {
    let tableNode = schema.tables.find((element) => {
      return element.name == current.table_name
    })

    if (tableNode == undefined) {
      let tableNode = { name: current.table_name, columns: [] }
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

module.exports = {
  transformMySQLDDLtoJSONSchema
}