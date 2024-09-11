var mssql      = require('mssql');

const connection = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
}

connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected");
	} else {
	    console.log("Error while connecting with database");
	}
});

module.exports = connection;
