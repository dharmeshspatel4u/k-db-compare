class KMySqlClient {
  constructor(connection) {
    this.connection = connection
  }

  async connect() {
    this.knex = require("knex")({
      client: "mysql",
      connection: {
        host: this.connection.hostName,
        user: this.connection.userName,
        password: this.connection.password,
        database: this.connection.databaseName,
        port: this.connection.port
      }
    })

    return true
  }

  async query(query, params) {
    if (this.knex == undefined) {
      this.connect()
    }
    let resp = await this.knex.raw(query, params)
    return resp
  }
}

module.exports = KMySqlClient
