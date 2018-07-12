let getSchemaTemplate = (connection) => {
  let timestamp = new Date().toUTCString()
  let schemaTemplate = { 
    schemaVersion: 1.0,
    createdOn: timestamp,
    connection: {
      institutionName: connection.institutionName,
      institutionUrlName: connection.institutionUrlName,
      databaseEnvironment: connection.databaseEnvironment,
      hostName: connection.hostName,
      databaseName: connection.databaseName
    },
    tables: [],
    configurationData: []
  }
  return schemaTemplate
}

let getSchemaCompareTemplate = (sourceSchema, targetSchema) => {
  let timestamp = new Date().toUTCString()
  return {
    schemaVersion: 1.0,
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
}

module.exports = {
  getSchemaTemplate,
  getSchemaCompareTemplate
}