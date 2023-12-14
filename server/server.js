const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get('/random', routes.random);
app.get('/allMovies', routes.allMovies);
app.get('/movie/:movie_id', routes.movie);
app.get('/movie/:movie_id/crew', routes.getCrewOfMovie);
app.get('/movie/:movie_id/genres', routes.getGenreOfMovie);
app.get('/topMovies', routes.topMovies);
app.get('/allPeople', routes.allPeople)
app.get('/person/:person_id', routes.person);
app.get('/search', routes.search);
app.get('/genre/top-movies', routes.topMoviesByGenre);
app.get('/director/randomPick', routes.PickOneRandomDirector);
app.get('/director/random', routes.getDirectorMovie);
app.get("/result/collaboration-summary", routes.getCollaborationSummary);
app.get("/result/genre-freq/:person_id", routes.getGenreFreqByPpl);
app.get("/result/job-freq/:person_id", routes.getJobFreqByPpl)
app.get("/personInfo/:person_id", routes.getPersonInfo);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
