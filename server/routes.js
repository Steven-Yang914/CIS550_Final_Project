const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


const random = async function (req, res) {
  const isAdult = req.query.isAdult;

  if (!isAdult) {
    connection.query(`
    SELECT *
    FROM Movies, Posters
    WHERE Movies.MovieID = Posters.MovieID
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    });
  } else {
    connection.query(`
    SELECT *
    FROM Movies
    WHERE IsAdult = ${isAdult}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    });
  }
}

module.exports = {
  random,
}
