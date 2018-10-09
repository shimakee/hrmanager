const config = require('config');
const winston = require('winston'); //error handler
require('winston-mongodb');//-*
require('express-async-errors');//route try catch wrapper

const URI_ERROR = config.get('db_log.uri');//database//-*

module.exports = function(){
    if(config.util.getEnv('NODE_ENV') === "test"){
        winston.handleExceptions(//handling Errors outside express
            new winston.transports.Console({colorize: true, prettyPrint: true, level: 'error'}),
            new winston.transports.File({filename:'uncaughtExceptions.log', level: 'error'})
        );
    }else{
        winston.handleExceptions(//handling Errors outside express
            new winston.transports.Console({colorize: true, prettyPrint: true, level: 'silly'}),
            new winston.transports.File({filename:'uncaughtExceptions.log', level: 'silly'})
        );
    }

    process.on('unhandledRejection', (err)=>{//handling Promise rejections
        throw err;//pass to uncaughtExceptions
    });
    winston.add(winston.transports.File, {filename: 'appLogFile.log'});//create log file
    winston.add(winston.transports.MongoDB, {db: URI_ERROR}); //database for errors//-*
}