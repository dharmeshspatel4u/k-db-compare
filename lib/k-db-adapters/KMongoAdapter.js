const KMongoClient = require('./../k-db-clients/KMongoClient')

class KMongoAdapter {
  constructor(connection) {
    this.connectionString = connection.connectionString
    this.KMongoClient = new KMongoClient(connection.connectionString)
  }

  async query(queryObj) {
    console.log(`KMongoAdapter querying (${queryObj.queryString})...`)
    let collection = await this.KMongoClient.getCollection(queryObj.database, queryObj.collection)
    let results = await collection.find(queryObj.queryString).limit(2).toArray()
    return results
  }

  async connect() {
    console.log('Connecting KMongoClient...')
    return await this.KMongoClient.connect()
  }

}

module.exports = KMongoAdapter
