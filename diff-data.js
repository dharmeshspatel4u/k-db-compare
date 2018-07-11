//const DataTransform = require("node-json-transform").DataTransform
const RdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')
const Config = require('config')
const FileSystem = require("fs")
const {Console} = require("console")

const source = Config.source
const targets = Config.targets
const options = Config.options
const timestamp = Date.now()
const comparisonResultsFile = `./output/comparisons/data-comparison-${target.connection.institutionUrlName}-${timestamp}.json`

const output = FileSystem.createWriteStream(comparisonResultsFile);
const errorOutput = FileSystem.createWriteStream('./output/stderr.log');

const Logger = new Console(output, errorOutput);

async function compare(callback) {

  let sourceSchema = await RdbmsCompare.getSchema(source, options)

  let targetSchema = await RdbmsCompare.getSchema(targets, options)
  let schemaResults = await RdbmsCompare.compare(sourceSchema, targetSchema, options)

  Logger.log(JSON.stringify(schemaResults, null, 2))

  callback(`Comparison Completed! ${schemaResults.differences.length} issues found.`)
}

compare((results)=>{
  console.log(results)
  process.exit(0)
})