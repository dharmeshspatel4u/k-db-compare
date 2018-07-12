const RdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')
const DateFormat = require("dateformat")
const FileSystem = require("fs")
const {Console} = require("console")

const CompareConfigs = require('./comparison-configs/comp-config.json')
const source = CompareConfigs.source
const options = CompareConfigs.options

const timestamp = DateFormat(new Date(), "yyyymmddhhMMss")
const schemaOutputFile = `./output/schemas/schema-${source.connection.institutionUrlName}-${timestamp}.json`
const output = FileSystem.createWriteStream(schemaOutputFile);
const errorOutput = FileSystem.createWriteStream('./output/stderr.log');

const Logger = new Console(output, errorOutput);

async function generateSchema(callback) {

  let sourceSchema = await RdbmsCompare.getSchema(source, options)
  Logger.log(JSON.stringify(sourceSchema, null, 2))

  callback(`Schema Generation Complete!`)
}

generateSchema((results)=>{
  console.log(results)
  process.exit(0)
})