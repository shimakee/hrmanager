const config = require('config');
const jwt = require('jsonwebtoken');

const auth = {
    isAuth: function(req,res,next){
        const token = req.header(config.get('token_header'));
        if(!token){return res.status(401).send({message: 'Access denied - no token provided'})}

        try{
            const decoded = jwt.verify(token, config.get('token'));

            req.user = decoded;

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
    }
    //role.isAllowed
}

module.exports = auth;