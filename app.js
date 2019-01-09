//  environment variable setup
const config = require('config');
//server
const express = require('express');
const app = express();
//error handling package
const winston = require('winston');

//startup setup
require('./startup/log')();//logging
require('./startup/config')();//config
require('./startup/db')(app);//database
require('./startup/util')(app);//routes & middleware use
// app.use(express.static(__dirname));//using directory to serve static index file for vue
app.use('/public', express.static(__dirname+'/assets/public'));//give static files in public assets folder

require('./startup/routes')(app);//routes & middleware use
require('./startup/utilities')();//tools & utilities like validation


app.use('*', express.static(__dirname));//catch all

const PORT = config.get('port') || 8080;

// app.on('db ready', ()=>{
        module.exports = app.listen(PORT, ()=>{//running server
                winston.info('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
                winston.info(`App: ${config.get('name')}`);
                winston.info(`using database ${config.get('db.name')}`)
                winston.info(`listening on port ${PORT}...`);
        });
// });

// exports.server = server;
// exports.server = server;
// exports.db = db;
// exports.db = connection;
// exports.server = server;
