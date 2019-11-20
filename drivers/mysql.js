const mysql = require("mysql");
const config = require("../config.json");
const env = global.env;

class MySqlModel {
  constructor() {
    this.connection = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
	
		console.log()

      this.connection = mysql.createPool({
        connectionLimit: 10,
        host: config.db.mysql[env].host,
        user: config.db.mysql[env].username,
        password: config.db.mysql[env].password,
        database: config.db.mysql[env].database,
        port: config.db.mysql[env].port,
        debug: false,
        supportBigNumbers: true,
        bigNumberStrings: true
      });

      this.connection.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }

        if (connection) {
          console.log("DB Connection Established !");
          connection.release();
          resolve(this);
        }
      });
    });
  }

  close() {
    if (this.connection !== null) {
      this.connection.end();
    }
  }
}

module.exports = () => {
  return new MySqlModel();
};
