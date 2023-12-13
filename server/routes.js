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

const search = async function (req, res) {
  // Extract search query from the request
  const searchTerm = req.query.searchTerm.trim();           // The search key
  const requestDataType = req.query.requestDataType.trim(); // Specify what type of data is being requested
  // For simplicity, this example splits the query into words
  // Search the movies database/API using the keywords
  // This is a placeholder function. Replace with your actual search logic.
  const searchResult = await searchDatabase(requestDataType, searchTerm);
  if (Array.isArray(searchResult) && searchResult.length > 0) {
    // Send the search results as JSON
    res.json(searchResult);
  } else {
    res.json([]);
  }
}
//   } catch (error) {
//     // Handle any errors
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

function searchDatabase(requestDataType, keyword) {
  return new Promise((resolve, reject) => {
    if(keyword) {
      if (requestDataType === 'movie') {
        connection.query(`WITH GoodMovies AS ( 
            SELECT *
            FROM Movies m 
            WHERE lower(PrimaryTitle) LIKE ? AND
                  m.MovieID IS NOT NULL
            )
          SELECT gm.*, r.*, po.PosterURL
          FROM GoodMovies gm JOIN Ratings r on gm.MovieID = r.MovieID 
              LEFT JOIN Posters po on gm.MovieID = po.MovieID`,
            [`%${keyword}%`],
            (err, data) => {
              if (err) {
                console.log(err);
                reject('There was an error querying the database.');
              } else {
                console.log(data)
                resolve(data);
              }
            }
        );
      }
      else if (requestDataType === 'person') {
        connection.query(`
        SELECT *
        FROM People
        WHERE lower(Name) LIKE lower('%${keyword}%') AND
          People.PeopleID IS NOT NULL`,
            (err, data) => {
              if (err) {
                console.log(err);
                reject('There was an error querying the database.');
              } else {
                resolve(data);
              }
            }
        );
      }
    } else {
      resolve([]);
    }
  });
}

const randomDirector = async function (req, res) {
  connection.query(`
WITH randomID AS (
SELECT PeopleID
FROM Crew_in
WHERE Job = 'director'
ORDER BY RAND()
Limit 1
),
    IDCi as (
    SELECT ri.PeopleID, ci.MovieID
    FROM randomID ri
    JOIN Crew_in ci on ri.PeopleID = ci.PeopleID
),
    DirectorIDs AS (
    SELECT p.*, ic.MovieID
    FROM IDCi ic JOIN People p
        on ic.PeopleID = p.PeopleID
     )
  SELECT m.*, d.Name as Director
  FROM DirectorIDs d JOIN
       Movies m ON d.MovieID = m.MovieID;
      `, (err, data) => {
    if (err || data.length === 0) {
        console.log(err);
        res.json({});
    } else {
      console.log("random director's movies: ", data);
      res.json(data);
    }
  });
}


// function searchDatabase(requestDataType, keyword) {
//   if(keyword) {
//     if (requestDataType === 'movie') {
//       connection.query(`
//         SELECT *
//         FROM Movies
//         WHERE lower(PrimaryTitle) LIKE lower('%${keyword}%')`,
//           (err, data) => {
//             if (err) {
//               console.log(err);
//               return [];
//             } else {
//               console.log(data);
//               return data;
//             }
//           }
//       );
//     } else if (requestDataType === 'person') {
//       connection.query(`
//         SELECT *
//         FROM People
//         WHERE lower(Name) LIKE lower('%${keyword}%')`,
//             [keyword + '%'],
//           (err, data) => {
//             if (err) {
//               console.log(err);
//               return [];
//             } else {
//               return data;
//             }
//           }
//       );
//     }
//   }
// }
// async function searchMoviesDatabase(requestDataType, keyword) {
//   if(keyword) {
//     if (requestDataType === 'movie') {
//       connection.query(`
//       SELECT *
//       FROM Movies
//       WHERE lower(PrimaryTitle) LIKE lower('%${keyword}%')
//         `, (err, data) => {
//         if (err) {
//           console.log(err);
//           return [];
//         } else {
//           return data;
//         }
//       });
//     }
//   } else if (requestDataType === 'people') {
//     connection.query
//       SELECT *
//       FROM People
//       WHERE lower(p.Name) LIKE lower('%${keyword}%')
//     `, (err, data) => {
//       if (err) {
//         console.log(err);
//         return [];
//       } else {
//         return data;
//       }
//     });
//   }
// }

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

const topMoviesByGenre = async function (req, res) {
  connection.query(`WITH MaxRatings AS (
    SELECT og2.Genre, MAX(r2.AverageRating) AS MaxAvgRating
    FROM Ratings r2
    JOIN ofGenre og2 on r2.MovieID = og2.MovieID
    GROUP BY og2.Genre
    )
    SELECT rr.AverageRating, mrr.Genre,  mm.*
    FROM Ratings rr JOIN MaxRatings mrr
    on rr.AverageRating = mrr.MaxAvgRating
    JOIN Movies mm on mm.MovieID = rr.MovieID;`, (err, data) => {
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
  search,
  topMoviesByGenre,
  randomDirector
}
