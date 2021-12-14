const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-js',
    password: '556839'
})

module.exports = pool.promise();