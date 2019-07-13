const mysql = require('mysql');
const config = require('../config.json');
const env = global.env;

class MySqlModel {

	constructor() {

		this.connection = null;
	}

	connect() {

		return new Promise((resolve, reject)=>{

			this.connection = mysql.createPool({
		        connectionLimit : 10,
		        host     : config.db.mysql.host[env],
		        user     : config.db.mysql.credentials[env].username,
		        password : config.db.mysql.credentials[env].password,
		        database : config.db.mysql.database[env],
		        port     : config.db.mysql.port[env],
		        debug    :  false,
		        supportBigNumbers: true,
		        bigNumberStrings: true,
		    });

		   this.connection.getConnection((err, connection) => {

		        if (err) {

		            reject(err);
		        }

		        if (connection) {

		            console.log('DB Connection Established !');
		            connection.release();
		            resolve(this);
		        }

		    });

		});
	};

	close() {

		if(this.connection !== null) {

			this.connection.close();
		}
	}
}

module.exports = ()=>{ return new MySqlModel() };