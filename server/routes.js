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

module.exports = {
  random,
  getCollaborationSummary,
};
