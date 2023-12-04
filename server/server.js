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

app.get("/random", routes.random);

app.get("/result/collaboration-summary", routes.getCollaborationSummary);
app.get("/result/genre-freq", routes.getGenreFreqByPpl);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;

const express = require('express');
const port = 3000;

// Import routes
const movieRoutes = require('./routes');

// Middleware to parse JSON bodies
app.use(express.json());

// Use movie routes
app.use('/api', movieRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const express = require('express');

// Import routes
const movieRoutes = require('./routes');

// Middleware to parse JSON bodies
app.use(express.json());

// Use movie routes
app.use('/api', movieRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


