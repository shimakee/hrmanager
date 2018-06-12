const jwt = require('jsonwebtoken');

const auth = {
    isAuth: function(req,res,next){
        const token = req.header(process.env.RESPONSETOKENHEADER);
        if(!token){return res.status(401).send('Access denied - no token provided');}

        try{
            const decoded = jwt.verify(token, process.env.TOKENKEY);
            req.user = decoded;
            next();
        }catch(ex){
            res.status(400).send('Invalid token')
        }
    }
    //role.isAllowed
}

module.exports = auth;