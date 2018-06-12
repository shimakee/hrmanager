const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');



router.route('/edit/password').post((req,res,next)=>{
    //if authorized
        //validate-valid 
            //check if user exist
                //exist - check if old pass match
                    //match old pass - update to new password
                        //success - return message
                        //failed - return message
                    //mismatch - return message
                //does not exist - return message
        //invalid - return message
    //unauthorized
        //return - message
            //log unauthorized access
    next();
}).put((req,res,next)=>{
    //same as post above

    next();
});

router.route('/edit/user').post((req,res,next)=>{
    //if authorized
        //validate-valid password mos not be present in formdata
            //check if user exist
                //exist
                        //change userdetails
                            //success - return message
                            //failed - return message
                    //mismatch - return message
                //does not exist - return message bad request
        //invalid - return message
    //unauthorized
        //return - message
            //log unauthorized access
}).put((req,res,next)=>{
    //same as above
    next();
});

module.exports = router;