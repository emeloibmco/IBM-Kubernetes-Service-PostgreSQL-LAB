// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info';
const app = express();
const server = http.createServer(app);

app.use(log4js.connectLogger(logger, { level: logger.level }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// req.body will be available for Content-Type=application/json
app.use(bodyParser.json());

// Show movie
app.get("/api/movies", function(req, res, next) {
  Movie.model.findAll().then(function (user) {
		res.json(user);
	});
});

// Show movie
app.get("/api/movies/:id", function(req, res, next) {
Movie.model.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user){
    res.json(user);
  });
});

// Add new movie
app.post("/api/movies", function(req, res, next) { 
  Movie.model.create({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      director: req.body.director,
      year: req.body.year
    }).then(function(post) {
    res.json(post);
  }); 
});

// Update Movie
app.put("/api/movies/:id", function(req, res, next) {
Movie.model.findOne({
    where: {
      id: req.params.id
    }
    }).then(function(post) {
      if(post){
        post.update({
          title: req.body.title,
          description: req.body.description,
          director: req.body.director,
          year: req.body.year
        });
      }
      res.json(post);
  });
});

// DELETE Movie
app.delete("/api/movies/:id", function(req, res, next) {
  Movie.model.destroy({
    where: {
      id: req.params.id
    }
    }).then(function(post) {
      res.send('Mensaje eliminado');
  });
});

const port = process.env.PORT || localConfig.port;
server.listen(port, function(){
  logger.info(`AppNodejsPostgresql listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`AppNodejsPostgresql listening on http://localhost:${port}`);
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function (err, req, res, next) {
	res.sendFile(path.join(__dirname, '../public', '500.html'));
});

module.exports = server;
