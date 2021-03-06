const config = require('config');
const mongoose = require('mongoose');
//utilities
const winston = require('winston');
const Fawn = require('fawn');
// let URI = config.get('uri') || config.get('db.uri');
let URI;
const DB_NAME = config.get('db.name');

module.exports = async function(app){
    // return new Promise(async (resolve, reject)=>{
        if (config.util.getEnv('NODE_ENV') === "production"){
            //get production uri from env variables
            URI = config.get('uri');
            winston.info(`Using uri:${URI}`);
        }else{
            //get test uri from config
            URI = config.get('db.uri');
            winston.info(`Using uri:${URI}`);
        }
        
        await mongoose.connect(URI, {useNewUrlParser: true});
        
        Fawn.init(mongoose); //enable transaction
        
        const roller = Fawn.Roller(); //roll back unfinished transactions
                roller.roll()
                .then(()=>{
                    winston.info(`Rolled back unfinished transactions..`);
                });
                
        const connection = mongoose.connection;

        connection.on('error', (error)=>{
            winston.error(error);
            // reject(`Database ${DB_NAME} connection error: ${error}`);
        });
        connection.on('connected', ()=>{
            winston.info(`Connected to database ${DB_NAME}...`);
            // app.emit('db ready');
            // return connection;
            // resolve(connection);
        });
        connection.on('close', ()=>{
            winston.info(`Database ${DB_NAME} closed.`);
        });

        process.on('SIGINT', ()=>{//mongoose connection handler
            connection.close(()=>{
                    process.exit(0);
            });
        });
    // });
}

    // module.exports =function(app){
    //     mongoose.connect(URI)
    //         .then(()=>{winston.info(`Connected to database ${DB_NAME}...`);
                
    //             app.emit('db ready');
    //             return mongoose.connection;
    //         });
    
    //     // Fawn.init(mongoose); //enable transaction

    //     process.on('SIGINT', ()=>{//mongoose connection handler
    //         mongoose.connection.close(()=>{
    //                 winston.info(`Server terminated: database ${config.get('db.name')} closed`);
    //                 process.exit(0);
    //         });
    //     });
    // }