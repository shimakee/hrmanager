const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');



router.all('*', (req,res,next)=>{

});

module.exports = router;