const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

const random = async function (req, res) {
  const isAdult = req.query.isAdult;

  if (!isAdult) {
    connection.query(
      `
    SELECT *
    FROM Movies, Posters
    WHERE Movies.MovieID = Posters.MovieID
    ORDER BY RAND()
    LIMIT 1
  `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data[0]);
        }
      }
    );
  } else {
    connection.query(
      `
    SELECT *
    FROM Movies
    WHERE IsAdult = ${isAdult}
    ORDER BY RAND()
    LIMIT 1
  `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data[0]);
        }
      }
    );
  }
};

const getCollaborationSummary = async function (req, res) {
  const peopleIDs = req.query.peopleIDs;
  if (!peopleIDs || peopleIDs.length === 0) {
    return res.status(400).json({ error: "One or more IDs needed" });
  }
  const peopleIDstr = peopleIDs
    .split(",")
    .map((item) => `'${item}'`)
    .join(",");

  connection.query(
    `
    SELECT
        ci1.PeopleID AS ActorID1,
        ci2.PeopleID AS ActorID2,
        COUNT(*) AS NumberOfCollaborations,
        MAX(r.AverageRating) AS BestRating
    FROM
        Crew_in ci1
        JOIN Crew_in ci2 ON ci1.MovieID = ci2.MovieID AND ci1.PeopleID < ci2.PeopleID
        JOIN Movies m ON ci1.MovieID = m.MovieID
        JOIN Ratings r ON m.MovieID = r.MovieID
    WHERE
        ci1.PeopleID IN (${peopleIDstr}) AND
        ci2.PeopleID IN (${peopleIDstr})
    GROUP BY
        ci1.PeopleID, ci2.PeopleID;
  `,
    (err, data) => {
      if (err) {
        console.log("Error: " + err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const getJobFreqByPpl = async function (req, res) {
  const peopleID = req.params.person_id;
  if (!peopleID || peopleID.substring(0, 2) != 'nm') {
    return res.status(400).json({ error: "Wrong peopleID format" });
  }

  connection.query(
    `
    SELECT ci.Job, COUNT(*) as Frequency
    FROM Movies m
    JOIN Crew_in ci ON m.MovieID = ci.MovieID
    WHERE ci.PeopleID = '${peopleID}'
    GROUP BY ci.Job
    ORDER BY Frequency DESC;
  `,
    (err, data) => {
      if (err) {
        console.log("Error: " + err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const getGenreFreqByPpl = async function (req, res) {
  const peopleID = req.params.person_id;
  if (!peopleID || peopleID.substring(0, 2) != 'nm') {
    return res.status(400).json({ error: "Wrong peopleID format" });
  }

  connection.query(
    `
    SELECT
      g.Genre,
      COUNT(*) as Frequency
    FROM
      Movies m
      JOIN Crew_in ci ON m.MovieID = ci.MovieID
      JOIN ofGenre g ON m.MovieID = g.MovieID
    WHERE
      ci.PeopleID = '${peopleID}'
    GROUP BY
      g.Genre
    ORDER BY
      Frequency DESC;
  `,
    (err, data) => {
      if (err) {
        console.log("Error: " + err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};


const search = async function (req, res) {
  // Extract search query from the request
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const searchTerm = req.query.searchTerm.trim();           // The search key
  const requestDataType = req.query.requestDataType.trim(); // Specify what type of data is being requested
  // For simplicity, this example splits the query into words
  // Search the movies database/API using the keywords
  // This is a placeholder function. Replace with your actual search logic.
  const searchResult = await searchDatabase(requestDataType, searchTerm, page, pageSize);
  if (Array.isArray(searchResult) && searchResult.length > 0) {
    // Send the search results as JSON
    res.json(searchResult);
  } else {
    res.json([]);
  }
}

function searchDatabase(requestDataType, keyword, page, pageSize) {
  return new Promise((resolve, reject) => {
    if(keyword) {
      if (requestDataType === 'movie') {
        if (!page) {
            connection.query(`
            SELECT *
            FROM Movies m, Ratings r, Posters p
            WHERE m.MovieID = r.MovieID
            AND m.MovieID = p.MovieID
            AND lower(PrimaryTitle) LIKE ?
            ORDER BY r.AverageRating DESC
            LIMIT 200;  
            `, [`%${keyword}%`],
                (err, data) => {
                    if (err) {
                    console.log(err);
                    reject('There was an error querying the database.');
                    } else {
                    resolve(data);
                    }
                });
        } else {
            connection.query(`
            SELECT *
            FROM Movies m, Ratings r, Posters p
            WHERE m.MovieID = r.MovieID
            AND m.MovieID = p.MovieID
            AND lower(PrimaryTitle) LIKE ?
            ORDER BY r.AverageRating DESC
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
            `, [`%${keyword}%`],
                (err, data) => {
                    if (err) {
                    console.log(err);
                    reject('There was an error querying the database.');
                    } else {
                    resolve(data);
                    }
                });
        }
      } else if (requestDataType === 'person') {
        if (!page) {
            connection.query(`
            SELECT p.name, p.PeopleID
            FROM People p
            WHERE lower(Name) LIKE ?
            LIMIT 200;`,
                [`%${keyword}%`],
                (err, data) => {
                    if (err) {
                    console.log(err);
                    reject('There was an error querying the database.');
                    } else {
                    resolve(data);
                    }
                }
            );
        } else {
            connection.query(`
            SELECT p.name, p.PeopleID
            FROM People p
            WHERE lower(Name) LIKE ?
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
            `, [`%${keyword}%`],
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
      }
    } else {
      resolve([]);
    }
  });
}




const PickOneRandomDirector = async function (req, res) {
    connection.query(`
WITH randomID AS (
        SELECT PeopleID
        FROM Crew_in
        WHERE Job = 'director'
        ORDER BY RAND()
        Limit 1)
        SELECT p.*
        FROM randomID ri JOIN People p on ri.PeopleID = p.PeopleID;`
, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log("random director's movies: ", data);
            res.json(data);
        }
    });
}

const randomDirector = async function (req, res) {
    const page = req.query.page;
    const pageSize = req.query.page_size ?? 10;
    if (!page) {
        connection.query(`
WITH randomID AS (
      SELECT PeopleID
      FROM Crew_in
      WHERE Job = 'director'
      ORDER BY RAND()
      Limit 1
),
    selectedIn AS (
    SELECT ci.MovieID, rii.PeopleID
    FROM randomID rii JOIN Crew_in ci on rii.PeopleID = ci.PeopleID
    )
  SELECT m.MovieID, m.PrimaryTitle, p.Name as director, pp.PosterURL
  FROM selectedIn si
           JOIN People p on si.PeopleID = p.PeopleID
           JOIN Movies m on m.MovieID = si.MovieID
           LEFT JOIN Posters pp on pp.MovieID = si.MovieID
  LIMIT 200;
      `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                console.log("random director's movies: ", data);
                res.json(data);
            }
        })
    } else {
        connection.query(`
        WITH randomID AS (
      SELECT PeopleID
      FROM Crew_in
      WHERE Job = 'director'
      ORDER BY RAND()
      Limit 1
),
    selectedIn AS (
    SELECT ci.MovieID, rii.PeopleID
    FROM randomID rii JOIN Crew_in ci on rii.PeopleID = ci.PeopleID
    )
  SELECT m.MovieID, m.PrimaryTitle, p.Name as director, pp.PosterURL
  FROM selectedIn si
           JOIN People p on si.PeopleID = p.PeopleID
           JOIN Movies m on m.MovieID = si.MovieID
           LEFT JOIN Posters pp on pp.MovieID = si.MovieID
  LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
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
}
// -- WITH SelectPoster AS (
//     --     SELECT po.PosterURL, po.MovieID
// --     FROM Posters po
// --     WHERE LENGTH(po.PosterURL) > 2
// --   ),
// --  randomID AS (
//     --     SELECT PeopleID
// --     FROM Crew_in cii JOIN SelectPoster sp on cii.MovieID = sp.MovieID
// --     WHERE Job = 'director'
// --     ORDER BY RAND()
// --     Limit 1
// -- ),
// --     IDCi as (
//     --     SELECT ri.PeopleID, ci.MovieID
// --     FROM randomID ri
// --     JOIN Crew_in ci on ri.PeopleID = ci.PeopleID
// -- ),
// --     DirectorIDs AS (
//     --     SELECT p.*, ic.MovieID
// --     FROM IDCi ic JOIN People p
// --         on ic.PeopleID = p.PeopleID
// --      )
// --   SELECT m.*, d.Name as director
// --   FROM DirectorIDs d
// --       JOIN Movies m ON d.MovieID = m.MovieID
// --   ORDER BY d.AverageRating DESC
// --   LIMIT 10;


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

const topMoviesByGenre = async function (req, res) {
    const page = req.query.page;
    const pageSize = req.query.page_size ?? 10;

    if(!page){
        connection.query(`
              SELECT r.AverageRating, mrr.Genre as genre,  mm.*, ps.PosterURL, p.name as director
              FROM  Ratings r
                        JOIN Max_rating_genre mrr on r.AverageRating = mrr.MaxAvgRating
                        JOIN Movies mm on mm.MovieID = r.MovieID
                        JOIN Crew_in ci on mm.MovieID = ci.MovieID
                        JOIN People p on ci.PeopleID = p.PeopleID
                        LEFT JOIN Posters ps on mm.MovieID = ps.MovieID
              WHERE ci.Job = 'director'
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
              SELECT r.AverageRating, mrr.Genre as genre,  mm.*, ps.PosterURL, p.name as director
              FROM  Ratings r
                        JOIN Max_rating_genre mrr on r.AverageRating = mrr.MaxAvgRating
                        JOIN Movies mm on mm.MovieID = r.MovieID
                        JOIN Crew_in ci on mm.MovieID = ci.MovieID
                        JOIN People p on ci.PeopleID = p.PeopleID
                        LEFT JOIN Posters ps on mm.MovieID = ps.MovieID
              WHERE ci.Job = 'director'
              LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
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

const getPersonInfo = async function (req, res) {
  const personID = req.params.person_id;

  connection.query(`
    SELECT *
    FROM People p
    WHERE p.PeopleID = '${personID}'
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

const getDirectorMovie = async function (req, res) {
    const directorID = req.query.directorID;
    const page = req.query.page;
    const pageSize = req.query.page_size ?? 10;

    if (!page) {
        connection.query(`
            WITH directorInfo AS (SELECT pp.*
                                  FROM People pp
                                  WHERE pp.PeopleID = '${directorID}')
            SELECT m.*, di.Name as director, p.PosterURL
            FROM Movies m
                     JOIN Crew_in c on m.MovieID = c.MovieID
                     JOIN directorInfo di on c.PeopleID = di.PeopleID
                     JOIN Posters p on m.MovieID = p.MovieID
            LIMIT 200;
        `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json([]);
            } else {
                console.log("director's movies: ", data)
                res.json(data);
            }
        });
    } else {
        connection.query(`
            WITH directorInfo AS (SELECT pp.*
                                  FROM People pp
                                  WHERE pp.PeopleID = '${directorID}')
            SELECT m.*, di.Name as director, p.PosterURL
            FROM Movies m
                     JOIN Crew_in c on m.MovieID = c.MovieID
                     JOIN directorInfo di on c.PeopleID = di.PeopleID
                     LEFT JOIN Posters p on m.MovieID = p.MovieID
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
        `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json([]);
            } else {
                console.log("director's movies: ", data)
                res.json(data);
            }
        });
    }
}

module.exports = {
  random,
  getCollaborationSummary,
  getGenreFreqByPpl,
  allMovies,
  movie,
  getCrewOfMovie,
  getGenreOfMovie,
  topMovies,
  allPeople,
  person,
  search,
  topMoviesByGenre,
  randomDirector,
  PickOneRandomDirector,
  getDirectorMovie
  getPersonInfo,
  getJobFreqByPpl
};
