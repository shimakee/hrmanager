const config = require('config');
const jwt = require('jsonwebtoken');
const isObjectId = require('../util/tools').validate.isObjectId;

//TODO: //role.isAllowed

const auth = {
    isAuth: function(req,res,next){
        
        const tokenHeader = req.header(config.get('token_header'));
        const tokenCookie = req.signedCookies.token;
        
        if(!tokenHeader && !tokenCookie){return res.status(401).send({message: 'Access denied - no token provided'})}

        try{
            let token = tokenHeader || tokenCookie;
        
            const decoded = jwt.verify(token, config.get('token'));

            req.user = decoded;

            //profile must be an object id; - TODO: no longer needed - but left just incase
            // if(!isObjectId(decoded.profile)){
            //     if(isObjectId(decoded.profile._id)){
            //         req.user.profile = decoded.profile._id;
            //     }else{
            //         throw Error('No object id to attach to profile authentication middleware.');
            //     }
            // }

            next();
        }catch(ex){
            res.status(400).send({message: 'Invalid token'});
        }
    },
    isAccountType: function(accountType){
        return function(req, res, next){

            if(req.user.accountType == accountType){
                next();
            }else{
                res.status(401).send({message: `Unauthorized access. only ${accountType} accounts are allowed. `});
            }
        }
    },
    cors:function(req, res, next){
        const corsUrl = config.get('corsUrl');
        res.header("Access-Control-Allow-Origin", corsUrl); // to control cors vie env variables
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELTE, OPTIONS");
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header("Access-Control-Allow-Headers", `Origin, X-Requested-With, Content-Type, Accept, Authorization, ${config.get('token_header')}, exp`);
        res.header("Access-Control-Expose-Headers", `Origin, X-Requested-With, Content-Type, Accept, Authorization, ${config.get('token_header')}, exp`);
        next();
    }
}

module.exports = auth;