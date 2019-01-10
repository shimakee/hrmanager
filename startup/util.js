const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');

module.exports = function(app){
    //cookieparser
    app.use(cookieParser(config.get('cookieSecret')));
        
    //CORS
    app.options('*', cors()); //enable pre-flight
    //cors options
    const corsWhitelist = ['http://120.28.193.241', 'http://49.148.197.201', 'https://deleonhr.herokuapp.com', 'http://localhost', 'https://localhost'];// whitelist sources
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
            exposeHeaders:[config.get('token_header'), 'Content-Type', 'X-Auth-Hureon', 'Set-Cookie', 'Authorization'],
            allowHeaders:[config.get('token_header'), 'Content-Type', 'X-Auth-Hureon', 'Set-Cookie', 'Authorization'],
            preflightContinue: true
    }
    //implement cors
    app.use(cors(corsOption)); //allow cors
//     app.use(cors()); //allow all cors

//     app.use(function(req, res, next) {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-hureon, X-Auth-Hureon, Set-Cookie, Authorization");
//         next();
//       });
}