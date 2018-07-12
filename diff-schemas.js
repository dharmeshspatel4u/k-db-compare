//const DataTransform = require("node-json-transform").DataTransform
const RdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')
const FileSystem = require("fs")
const DateFormat = require("dateformat")
const {Console} = require("console")

const CompareConfigs = require('./comparison-configs/comp-config.json')
const source = CompareConfigs.source
const target = CompareConfigs.target
const options = CompareConfigs.options

const timestamp = DateFormat(new Date(), "yyyymmddhhMMss")

const schemaOutputFile = `./output/comparisons/schema-comparison-${target.connection.institutionUrlName}-${timestamp}.json`
const output = FileSystem.createWriteStream(schemaOutputFile);
const errorOutput = FileSystem.createWriteStream('./output/stderr.log');

const Logger = new Console(output, errorOutput);

const args = require('optimist').argv

async function compareSchema(callback) {

  let sourceSchema = ''
  if (args.sourceSchemaFile) {
    console.log('Loading schema from file')
    sourceSchema = JSON.parse(FileSystem.readFileSync(args.sourceSchemaFile, 'utf8'))
  } else {
    console.log('Generating source schema')
    sourceSchema = await RdbmsCompare.getSchema(source, options)
  }

  let targetSchema = await RdbmsCompare.getSchema(target, options)
  let schemaResults = await RdbmsCompare.compareSchema(sourceSchema, targetSchema)

  Logger.log(JSON.stringify(schemaResults, null, 2))

  callback(`Schema Comparison Completed! ${schemaResults.differences.length} issues found. Results written to ${schemaOutputFile}`)
}

compareSchema((results)=>{
  console.log(results)
  
  process.exit(0)
})