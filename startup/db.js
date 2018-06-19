const config = require('config');
const mongoose = require('mongoose');
const URI = config.get('db.uri');
const DB_NAME = config.get('db.name');
//utilities
const winston = require('winston');
const Fawn = require('fawn');


module.exports = function(){
    return new Promise((resolve, reject)=>{

        mongoose.connect(URI);
        
        Fawn.init(mongoose); //enable transaction
        const connection = mongoose.connection;

        connection.on('error', (error)=>{
            winston.error(error);
            reject(`Database ${DB_NAME} connection error: ${error}`);
        });
        connection.on('open', (data)=>{
            winston.info(`Connected to database ${DB_NAME}...`);
            resolve(connection);
        });
        connection.on('close', ()=>{
            winston.info(`Database ${DB_NAME} closed.`);
        });
    });

    // module.exports =function(){
        // mongoose.Promise = Promise;
        // mongoose.connect(URI);
            // .then(()=>{winston.info(`Connected to database ${DB_NAME}...`)});
    
        // Fawn.init(mongoose); //enable transaction
    // }
    
}