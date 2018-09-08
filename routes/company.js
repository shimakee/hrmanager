const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
//models
const Company = require('../models/company');
const _ = require('lodash');

//find things necessary to be populated
//create middleware to check if company id is present in req.user after authentication
//get company info
router.route('/me').get(auth.isAuth, async (req,res,next)=>{
        const user = req.user;
        let  company = await Company.findById(user.company).populate('owner.profile').populate('business').populate('applicants').populate('employees').exec();
        if(!company){return res.status(400).send({message: 'Bad request.'});}//remove error handling because of wrapper?

        //change _ method to pick instead of omit
        company = _.pick(company.toObject(), ['tradename', 'ownershipType', 'owner', 'business', 'pics', 'companyPicName', 'contact', 'emai', 'address', 'government', 'applicants', 'employees']);//remove important properties
        res.status(200).send(company);

//edit company
}).put(auth.isAuth, (req,res,next)=>{

});

module.exports = router;