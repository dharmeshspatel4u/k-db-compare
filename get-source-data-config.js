const RdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')
const FileSystem = require("fs")
const {Console} = require("console")

const CompareConfigs = require('./comparison-configs/comp-config.json')
const source = CompareConfigs.source
const options = CompareConfigs.options

const timestamp = Date.now()
const dataOutputFile = `./output/data-configs/data-${source.connection.institutionUrlName}-${timestamp}.json`
const output = FileSystem.createWriteStream(dataOutputFile);
const errorOutput = FileSystem.createWriteStream('./output/stderr.log');

const Logger = new Console(output, errorOutput);

async function generateDataConfig(callback) {

  let sourceDataConfig = await RdbmsCompare.getDataConfig(source, options)
  Logger.log(JSON.stringify(sourceDataConfig, null, 2))

  callback(`DataConfig Generation Complete!`)
}

generateDataConfig((results)=>{
  console.log(results)
  process.exit(0)
})