//  environment variable setup
const config = require('config');
// require('dotenv').config();//required to run .env variables
//server
const express = require('express');
const app = express();
//error handling package
const winston = require('winston');
//startup setup
require('./startup/log')();//logging
require('./startup/config')();//config
require('./startup/db')(app);//database
// app.use(express.static(__dirname));//using directory to serve static index file for vue

require('./startup/routes')(app);//routes & middleware use
require('./startup/utilities')();//tools & utilities like validation

// app.use('*', express.static(__dirname));//catchall

const PORT = config.get('port') || 8080;

// app.on('db ready', ()=>{
        module.exports = app.listen(PORT, ()=>{//running server
                winston.info('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
                winston.info(`App: ${config.get('name')}`);
                winston.info(`listening on port ${PORT}...`);
        });
// });

// exports.server = server;
// exports.server = server;
// exports.db = db;
// exports.db = connection;
// exports.server = server;

//TODO: add routes for staff
