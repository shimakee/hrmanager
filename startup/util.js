const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');

module.exports = function(app){
    //cookieparser
    app.use(cookieParser(config.get('cookieSecret')));
        
    //CORS
    app.options('*', cors()); //enable pre-flight
    //cors options
    const corsWhitelist = ['http://120.28.193.241', 'https://deleonhr.herokuapp.com', 'http://localhost', 'https://localhost'];// whitelist sources
    const corsOption = {
            origin: function(origin, callback){
                //     console.log('origin', origin);
                    if(corsWhitelist.indexOf(origin) !== -1 || !origin){
                            callback(null, true);
                    }else{
                            callback(new Error('Source not allowed by cors.'));
                    }
            },
            methods: ['GET','POST','PUT','DELETE'],
            exposeHeaders:[config.get('token_header')],
            preflightContinue: true
    }
    //implement cors
    app.use(cors(corsOption)); //allow cors
}