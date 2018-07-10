//const DataTransform = require("node-json-transform").DataTransform
const rdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')
const config = require('config')

async function compare(callback) {

  let source = config.source
  let targets = config.targets
  let options = config.options

  for (let i=0; i<targets.length; i++) {
    await rdbmsCompare.compare(source, targets[i], options)
  }
  callback("done")
}

compare((results)=>{
  console.log(results)
  process.exit(0)
})