//const DataTransform = require("node-json-transform").DataTransform
const RdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')
const Config = require('config')
const FileSystem = require("fs")
const {Console} = require("console")

const CompareConfigs = require('./comparison-configs/comp-config.json')
const source = CompareConfigs.source
const target = CompareConfigs.target
const options = CompareConfigs.options

const timestamp = Date.now()
const comparisonResultsFile = `./output/comparisons/data-comparison-${target.connection.institutionUrlName}-${timestamp}.json`

const output = FileSystem.createWriteStream(comparisonResultsFile);
const errorOutput = FileSystem.createWriteStream('./output/stderr.log');

const Logger = new Console(output, errorOutput);

async function compareDataConfigs(callback) {
  let sourceDataConfig = await RdbmsCompare.getDataConfig(source, options)
  let targetDataConfig = await RdbmsCompare.getDataConfig(target, options)

  let dataConfigResults = await RdbmsCompare.compareDataConfig(sourceDataConfig, targetDataConfig, options)

  Logger.log(JSON.stringify(dataConfigResults, null, 2))

  callback(`DataConfig Comparison Completed! ${dataConfigResults.differences.length} issues found.`)
}

compareDataConfigs((results)=>{
  console.log(results)
  process.exit(0)
})