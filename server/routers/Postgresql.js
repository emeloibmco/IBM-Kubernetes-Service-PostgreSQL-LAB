
'use strict';

const bodyParser = require('body-parser');
const Sequelize = require('sequelize');


module.exports = function(app){

	// set up other middleware  __Manejo de la informacion recibida de las peticiones
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	//postgres://ibm_cloud_966f3f51_b5e2_4678_b67e_ac0a2b656245:7e94f4f9580854532dcd21c8c56af376880f22bd69cc52914955512ef94b8350@8b6dd240-f0c0-4efd-85ca-16806cf78792.bkvfu0nd0m8k95k94ujg.databases.appdomain.cloud:32079/ibmclouddb?sslmode=verify-full
	//const sequelize = new Sequelize('postgres://admin:FSRPLZEBOCELLAUG@sl-us-south-1-portal.58.dblayer.com:26151/compose')
	// connect to the MongoDB
	const sequelize = new Sequelize('ibmclouddb', 'ibm_cloud_966f3f51_b5e2_4678_b67e_ac0a2b656245', '7e94f4f9580854532dcd21c8c56af376880f22bd69cc52914955512ef94b8350', {
		dialect: 'postgres',
		dialectOptions: {
		  ssl : {
			  ca : 'MIIDDzCCAfegAwIBAgIJANEH58y2/kzHMA0GCSqGSIb3DQEBCwUAMB4xHDAaBgNVBAMME0lCTSBDbG91ZCBEYXRhYmFzZXMwHhcNMTgwNjI1MTQyOTAwWhcNMjgwNjIyMTQyOTAwWjAeMRwwGgYDVQQDDBNJQk0gQ2xvdWQgRGF0YWJhc2VzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8lpaQGzcFdGqeMlmqjffMPpIQhqpd8qJPr3bIkrXJbTcJJ9uIckSUcCjw4Z/rSg8nnT13SCcOl+1to+7kdMiU8qOWKiceYZ5y+yZYfCkGaiZVfazQBm45zBtFWv+AB/8hfCTdNF7VY4spaA3oBE2aS7OANNSRZSKpwy24IUgUcILJW+mcvW80Vx+GXRfD9Ytt6PRJgBhYuUBpgzvngmCMGBn+l2KNiSfweovYDCD6Vngl2+6W9QFAFtWXWgF3iDQD5nl/n4mripMSX6UG/n6657u7TDdgkvA1eKI2FLzYKpoKBe5rcnrM7nHgNc/nCdEs5JecHb1dHv1QfPm6pzIxwIDAQABo1AwTjAdBgNVHQ4EFgQUK3+XZo1wyKs+DEoYXbHruwSpXjgwHwYDVR0jBBgwFoAUK3+XZo1wyKs+DEoYXbHruwSpXjgwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAJf5dvlzUpqaix26qJEuqFG0IP57QQI5TCRJ6Xt/supRHo63eDvKw8zR7tlWQlV5P0N2xwuSl9ZqAJt7/k/3ZeB+nYwPoyO3KvKvATunRvlPBn4FWVXeaPsG+7fhSqsejmkyonYw77HRzGOzJH4Zg8UN6mfpbaWSsyaExvqknCp9SoTQP3D67AzWqb1zYdoqqgGIZ2nxCkp5/FXxF/TMb55vteTQwfgBy60jVVkbF7eVOWCv0KaNHPF5hrqbNi+3XjJ7/peF3xMvTMoy35DcT3E2ZeSVjouZs15O90kI3k2daS2OHJABW0vSj4nLz+PQzp/B9cQmOO8dCe049Q3oaUA==',
		  }
		},
		host: '8b6dd240-f0c0-4efd-85ca-16806cf78792.bkvfu0nd0m8k95k94ujg.databases.appdomain.cloud',
		port: 32079
	  })

	sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

	//Modelo de datos
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

	  model.sync({force: true}).then(function () {
		// Table created
		  return model.create({
			id: '123',
		  	title: 'John Hancock',
			description: 'prueba de coneccion',
			director: 'Charles P',
			year: '2005'
		  });
	  }); 

	  module.exports.model = model;
};
