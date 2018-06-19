//  environment variable setup
const config = require('config');
require('dotenv').config();//required to run .env variables
//server
const express = require('express');
const app = express();
//error handling package
const winston = require('winston');
const mongoose = require('mongoose');
//startup setup
require('./startup/log')();//logging
const db = require('./startup/db')();//database
require('./startup/config')();//config

app.use(express.static(__dirname));//using directory to serve static index file for vue

require('./startup/routes')(app);//routes & middleware use
require('./startup/utilities')();//tools & utilities like validation

const PORT = config.get('port') || 8080;
let server = app.listen(PORT, ()=>{//running server
        winston.info('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
        winston.info(`App: ${config.get('name')}`);
        winston.info(`listening on port ${PORT}...`);
});

process.on('SIGINT', ()=>{//mongoose connection handler
        mongoose.connection.close(()=>{
                winston.info(`Server terminated: database ${config.get('db.name')} closed`);
                process.exit(0);
        });
    });

exports.server = server;
exports.db = db;