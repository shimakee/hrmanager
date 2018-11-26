//  environment variable setup
const config = require('config');
// require('dotenv').config();//required to run .env variables
//server
const express = require('express');
const cors = require('cors');
const app = express();
//error handling package
const winston = require('winston');
//startup setup
require('./startup/log')();//logging
require('./startup/config')();//config
require('./startup/db')(app);//database
app.use(express.static(__dirname));//using directory to serve static index file for vue

app.options('*', cors()); //enable pre-flight

const corsWhitelist = ['http://120.28.193.241', 'https://deleonhr.herokuapp.com'];/ / whitelist sources
const corsOption = {
        origin: function(origin, callback){
                if(corsWhitelist.indexOf(origin) !== -1 || !origin){
                        callback(null, true);
                }else{
                        callback(new Error('Source not allowed by cors.'));
                }
        },
        methods: ['GET','POST','PUT','DELETE'],
        exposeHeaders:[config.get('token_header')]
}

app.use(cors(corsOption));
require('./startup/routes')(app);//routes & middleware use
require('./startup/utilities')();//tools & utilities like validation


app.use('*', express.static(__dirname));//catchall

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
