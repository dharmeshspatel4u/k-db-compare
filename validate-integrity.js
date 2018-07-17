const RdbmsCompare = require('./lib/k-db-compare/RDBMSCompare')

const CompareConfigs = require('./comparison-configs/comp-config.json')
const target = CompareConfigs.target
const options = CompareConfigs.options

async function validateIntegrity(callback) {

  let schemaResults = await RdbmsCompare.validateIntegrity(target, options)

  console.log(JSON.stringify(schemaResults, null, 2))

  callback(`Integrity Validation Completed! ${schemaResults.length} inconsistencies found.`)
}

validateIntegrity((results)=>{
  console.log(results)
  
  process.exit(0)
})