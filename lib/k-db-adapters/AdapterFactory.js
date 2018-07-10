const KMongoAdapter = require('./KMongoAdapter')
const KMySqlAdapter = require('./KMySqlAdapter')

let adapterCache = {}

function getAdapter (adapterType, connection) {
  if (adapterType == 'mongo') {
    let adapter = new KMongoAdapter(connection)
    adapter.connect()
    return adapter
  } else if (adapterType == 'mysql') {
      let adapter = new KMySqlAdapter(connection)
      adapter.connect()
      return adapter
  } else {
    console.log(connection)
    throw 'Unknown adapter type'
  }
}

module.exports = {
  getAdapter
}