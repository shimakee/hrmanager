const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');

module.exports = function(app){
    //cookieparser
    app.use(cookieParser(config.get('cookieSecret')));
        
    //CORS
    app.options('*', cors()); //enable pre-flight
    //cors options
    const corsWhitelist = ['http://120.28.193.241', 'http://49.148.197.201', 'https://deleonhr.herokuapp.com', 'http://localhost', 'https://localhost', 'http://localhost:8080', 'https://localhost:8080'];// whitelist sources
    const corsOption = {
        origin: function(origin, callback){
        //     console.log('origin', origin);
                if(corsWhitelist.indexOf(origin) !== -1 || !origin){
                        callback(null, true);
                }else{
                        callback(new Error('Source not allowed by cors.'));
                }
        },
        // origin: 'http://localhost:8080',
        methods: ['GET','POST','PUT','DELETE'],
        allowedHeaders:[config.get('token_header'), 'Content-Type', 'X-Auth-Hureon', 'Set-Cookie', 'Authorization'],
        exposeHeaders:[config.get('token_header'), 'Content-Type', 'X-Auth-Hureon', 'Set-Cookie', 'Authorization', 'x-auth-hureon'],
        preflightContinue: true
    }
    //implement cors
//     app.use(cors(corsOption)); //allow cors
//     app.use(cors()); //allow all cors

    app.use(function(req, res, next) { //TODO create middle ware
        res.header("Access-Control-Allow-Origin", config.get('corsUrl')); // to control cors vie env variables
        // res.header("Access-Control-Allow-Origin", '*');
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELTE, OPTIONS");
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-hureon, exp");
        res.header("access-control-expose-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-hureon, exp");
        next();
      });
}