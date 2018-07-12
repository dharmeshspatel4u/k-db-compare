# k-db-compare
Utility to compare databases
---
There are two types of comparisons:
  * Database Schema
  * Database Data Configuration

Database Schema Structure checks for matching tables, columns & column definition attributes.

Database Data Configuration allows for custom queries to define recordsets to compare.

## Pre-requisites
Make sure you have [Node.js](nodejs.org) installed.

## Getting Started

### Local Setup
`git clone https://github.com/KualiCo/k-db-compare.git`

`cd k-db-compare`

`npm install`

### Configuration
Create a `./comparison-configs/comp-config.json` configuration file using `./comparison-configs/comp-config.json.example` as a reference

## Usage
### Generate a schema definition file

`npm run-script generate-source-schema`

Location of generated schema files: ./output/schemas/

### Generate a data config definition file

`npm run-script generate-source-data-config`

Location of generated data config files: ./output/data-configs/

### Generate a comparison file with the results of diff'ing two schemas

To generate the source schema file to be used:

`npm run-script diff-schemas`

To provide the source schema file:

`npm run-script diff-schemas -- --sourceSchemaFile=./output/schemas/schema-inu-20180711103001.json`

Location of generated comparison files: ./output/comparisons/

### Generate a comparison file with the results of diff'ing two data configs

To generate the source data config file to be used:

`npm run-script diff-data-configs`

To provided source data config:

`npm run-script diff-data-configs -- --sourceDataConfig=./output/data-configs/data-inu-20180711103001.json`


Location of generated comparison files: ./output/comparisons/

### Helper script that runs both schema comparison and data config comparison

`npm run-script diff-schema-and-configs`


#### Configuration Options
  You must configure a source connection to be used when generating schema and data config files. It's optional for comparisons if previously generated file is proveded.

  `source` - The master database to compare to

  `adapterType` - The database adapter to use

  `connection` - Database connection attributes

  Target database will be connected to when comparing against source

  `target` - The target database to compare against source

  `adapterType` - The database adapter to use

  `connection` - Database connection attributes

Options:
  `schemaOptions`
    `excludeTables` - List of tables to ignore

  `dataConfigOptions`
    `queries` - Custom queries to define data that should be compared
      
  Each object with the `queries` section must define three attributes `configName, query, keyColumn`
  
  `query` - The query that defines the dataset to be compared

  `configName` to reference results back to

  `keyColumn` used to identify uniqueness to assist in comparing the two dataset


#### Sample Configuration
```
{
  "source": {
    "adapterType": "mysql",
    "connection": {
      "institutionName": "Institution Name",
      "institutionUrlName": "inu",
      "databaseEnvironment": "stg",
      "hostName": "localhost",
      "databaseName": "inu_stg",
      "userName": "dbUser",
      "password": "password",
      "port": "3306"
    }
  },
  "target": {
    "adapterType": "mysql",
    "connection": {
      "institutionName": "Institution Name",
      "institutionUrlName": "inu",
      "databaseEnvironment": "stg",
      "hostName": "localhost",
      "databaseName": "inu_stg",
      "userName": "dbUser",
      "password": "password",
      "port": "3306"
    }
  },
  "options": {
    "schemaOptions": {
      "excludeTables": ""
    },
    "dataConfigOptions": {
      "queries": [{
        "configName": "parameter_keys",
        "query": "select concat(nmspc_cd, '.', cmpnt_cd, '.', parm_nm) as dataKey, isnull(val) as isValueNull from krcr_parm_t",
        keyColumn: "dataKey"
      }]
    }
  }
}
```
