const winston = require('winston'); //error handler
require('winston-mongodb');
require('express-async-errors');//route try catch wrapper

const   URIERROR    =       process.env.URIERROR;//database

module.exports = function(){
    winston.handleExceptions(//handling Errors outside express
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({filename:'uncaughtExceptions.log'}));
    process.on('unhandledRejection', (err)=>{//handling Promise rejections
        throw err;//pass to uncaughtExceptions
    });
    winston.add(winston.transports.File, {filename: 'appLogFile.log'});//create log file
    winston.add(winston.transports.MongoDB, {db: URIERROR}); //database for errors
}