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
    SELECT p.Name, c.Job, c.Characters, p.PeopleID
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

// const person = async function (req, res) {
//   const personID = req.params.person_id;

//   connection.query(`
//     SELECT *
//     FROM Movies m, People p, Crew_in c
//     WHERE c.MovieID = m.MovieID AND c.PeopleID = p.PeopleID
//     AND p.PeopleID = '${personID}'
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json([]);
//     } else {
//       res.json(data);
//     }
//   });
// }
const person = async function (req, res) {
  const personID = req.params.person_id;

  connection.query(`
      SELECT m.MovieID, m.PrimaryTitle, m.StartYear AS Year, c.Job
      FROM Movies m
      JOIN Crew_in c ON m.MovieID = c.MovieID
      WHERE c.PeopleID = '${personID}'
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
    SELECT p.Name, p.*
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
  getPersonInfo,
  getJobFreqByPpl,
};

// const express = require('express');
// const router = express.Router();

// // Search Movies by Title
// router.get('/searchMovies', (req, res) => {
//     const title = req.query.title;
//     const page = req.query.page || 1;
//     const pageSize = req.query.page_size || 10;
//     // Add logic to query database and return results
//     res.json({ message: "Movies with title " + title });
// });

// // Movie Recommendations Based on Genre
// router.get('/recommendations', (req, res) => {
//     const genre = req.query.genre;
//     const limit = req.query.limit || 10;
//     // Add logic to query database and return recommendations
//     res.json({ message: "Recommendations for genre " + genre });
// });

// // List Movies Featuring a Specific Actor/Actress
// router.get('/moviesByActor', (req, res) => {
//     const actorName = req.query.actor_name;
//     const page = req.query.page || 1;
//     const pageSize = req.query.page_size || 10;
//     // Add logic to query database and return movies
//     res.json({ message: "Movies featuring " + actorName });
// });

// module.exports = router;