

const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
var bodyParser = require('body-parser');

// inicio
// Importar Modulo Movies
var Movie = require('./routers/Postgresql');


const logger = log4js.getLogger(appName);
const app = express();
const server = http.createServer(app);

app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// Movies APIs
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
  
  logger.info(`meanexample listening on http://localhost:${port}`);
});

app.use(function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function(err, req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '500.html'));
});
module.exports = server;