const config = require('config');
const jwt = require('jsonwebtoken');

const auth = {
    isAuth: function(req,res,next){
        
        const tokenHeader = req.header(config.get('token_header'));
        const tokenCookie = req.cookies.token;
        
        if(!tokenHeader && !tokenCookie){return res.status(401).send({message: 'Access denied - no token provided'})}

        try{
            let token = tokenHeader || tokenCookie;
        
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