module.exports = function() {
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'mysqlroot',
        database : 'users_info'
    });//createConnection
    conn.connect();
    return conn;
}//module.exports