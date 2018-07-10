const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient

class KMongoClient {
  constructor(connectionString) {
    this.connectionString = connectionString
  }

  async getCollection(dbName, collectionName) {
    console.log(`KMongoClient.getCollection(${dbName}, ${collectionName})`)
    const db = this.connection.db(dbName)
    const collection = db.collection(collectionName)

    this.db = db
    this.currentCollection = collection

    return await this.db.collection(collectionName)
  }

  async connect() {
    const connection = await MongoClient.connect(this.connectionString)
    this.connection = connection

    return true
  }
}

module.exports = KMongoClient
