var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "mysql-200755c9-uzairrajput-20bd.a.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_og0tNo1inJjCF6xyVem",
  database: "souqdb",
  port: 18460
});

con.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to Database');
  }
});

module.exports = con;