const mysql = require('mysql');
const config = require('./config.js').db;

let conn = mysql.createConnection({
	host     : config.host,
	port     : config.port,
	user     : config.user,
	password : config.password,
	database : config.database
});

conn.connect()
	.then(result => conn.query('SELECT 2+2 AS four'))
	.then(result => console.log(result))
;

module.exports = {};
