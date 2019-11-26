/*
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
 */

'use strict';

const bodyParser = require('body-parser');
const Sequelize = require('sequelize');


module.exports = function(app){

	// set up other middleware  __Manejo de la informacion recibida de las peticiones
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());


	// connect to the Postgresql
	const sequelize = new Sequelize('postgres', 'postgres', 'Passw0rd', {
		host: 'localhost',
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		  }
	});

	//Validation 
	sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

	//Model of data
	var model = sequelize.define('peliculas', {
		id: {
		  type: Sequelize.INTEGER,
		  primaryKey: true
		},
		title: {
		  type: Sequelize.STRING
		},
		description: {
		  type: Sequelize.STRING
		},
		director: {
		  type: Sequelize.STRING
		},
		year: {
		  type: Sequelize.INTEGER
		}
	  }, {
		freezeTableName: true // Model tableName will be the same as the model name
	  });

	/*
	   model.sync({force: true}).then(function () {
		// Table created
		  return model.create({
			id: '123',
		  	title: 'John Hancock',
			description: 'prueba de coneccion',
			director: 'Charles P',
			year: '2005'
		  });
	  }); */

	  module.exports.model = model;
};
