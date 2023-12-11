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

<<<<<<< Updated upstream
=======
const search = async function (req, res) {
  try {
    // Extract search query from the request
    const searchTerm = req.query.searchTerm;           // The search key
    const requestDataType = req.query.requestDataType; // Specify what type of data is being requested
    const peopleType = req.query.peopleType;           // Specify what type of people is being requested
    const genre = req.query.genre;                     // Specify what genre is being requested

    // For simplicity, this example splits the query into words
    const keywords = searchTerm.split(' '); // Can only take in names and words that don't have symbols other than
                                            // space

    // Search the movies database/API using the keywords
    // This is a placeholder function. Replace with your actual search logic.
    const searchResults = [];
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i].toLowerCase();
      const searchResult = await searchMoviesDatabase(requestDataType, keyword);
      searchResults.push(...searchResult);
    }

    // Send the search results as JSON
    res.json(searchResults);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function searchMoviesDatabase(requestDataType, keyword) {
  if(keyword) {
    if (requestDataType === 'movie') {
      connection.query(`
      SELECT *
      FROM Movies 
      WHERE lower(PrimaryTitle) LIKE lower('%${keyword}%')
        `, (err, data) => {
        if (err) {
          console.log(err);
          return [];
        } else {
          return data;
        }
      });
    }
  } else if (requestDataType === 'people') {
    connection.query(`
      SELECT *
      FROM People
      WHERE lower(p.Name) LIKE lower('%${keyword}%')
    `, (err, data) => {
      if (err) {
        console.log(err);
        return [];
      } else {
        return data;
      }
    });
  }
}

>>>>>>> Stashed changes
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
    FROM Movies m, Ratings r, Posters po
    WHERE m.MovieID = r.MovieID
    AND m.MovieID = po.MovieID
    AND m.MovieID = '${movieID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}
const getCrewOfMovie = async function (req, res) {
  const movieID = req.params.movie_id;

  connection.query(`
    SELECT p.Name, c.Job, c.Characters
    FROM Movies m, People p, Crew_in c
    WHERE c.MovieID = m.MovieID
    AND c.PeopleID = p.PeopleID
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
  getCrewOfMovie,
  getGenreOfMovie,
  topMovies,
  allPeople,
  person,
}
