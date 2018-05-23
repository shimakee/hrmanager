const   express = require('express'),
        router = express.Router({mergeParams: true});

router.route('/signup').get((req,res,next)=>{
    const sampleData = {
        name: 'Kenneth',
        age: 28,
        nationality: 'Filipino',
        gender:'male',
        civilStatus:'married'
    }
    res.json(sampleData);
});

module.exports = router;