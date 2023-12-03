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

const allMovies = async function (req, res) {
  connection.query(`
    SELECT *
    FROM Movies
    ORDER BY StartYear DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const movie = async function (req, res) {
  const movieID = req.params.movie_id;

  connection.query(`
    SELECT *
    FROM Movies m, People p, Crew_in c, Ratings r
    WHERE c.MovieID = m.MovieID
    AND c.PeopleID = p.PeopleID
    AND m.MovieID = r.MovieID
    AND m.MovieID = '${movieID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const topMovies = async function (req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
    SELECT *
    FROM Movies m, Ratings r, Posters p
    WHERE m.MovieID = r.MovieID
    AND m.MovieID = p.MovieID
    AND r.NumVotes > 100000
    ORDER BY r.AverageRating DESC
    LIMIT 200;  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
  } else {
    connection.query(`
    SELECT *
    FROM Movies m, Ratings r, Posters p
    WHERE m.MovieID = r.MovieID
    AND m.MovieID = p.MovieID
    AND r.NumVotes > 100000
    ORDER BY r.AverageRating DESC
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
  `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

const allPeople = async function (req, res) {
  connection.query(`
    SELECT *
    FROM People
    ORDER BY Name ASC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const person = async function (req, res) {
  const personID = req.params.person_id;

  connection.query(`
    SELECT *
    FROM Movies m, People p, Crew_in c
    WHERE c.MovieID = m.MovieID AND c.PeopleID = p.PeopleID
    AND p.PeopleID = '${personID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const getGenreOfMovie = async function (req, res) {
  const movieID = req.params.movie_id;

  connection.query(`
    SELECT og.Genre
    FROM Movies m, ofGenre og
    WHERE m.MovieID = og.MovieID
    AND m.MovieID = '${movieID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  random,
  allMovies,
  movie,
  getGenreOfMovie,
  topMovies,
  allPeople,
  person,
}
