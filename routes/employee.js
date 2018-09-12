const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
//models
const Company = require('../models/company');
const User = require('../models/user');
const Business = require('../models/business');
const Employee = require('../models/employee');
//tools
const _ = require('lodash');
const Fawn = require('fawn');

router.route('/me').get(auth.isAuth, async (req, res, next)=>{
    
});

//TODO: crud employees

module.exports = router;