const express = require('express');
const routes = require('./routes');
const log = require('./log');

const app = express();

app.use(routes);

app.use(function(err, req, res, next) {
  log.error(err);
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
