const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
//models
const Company = require('../models/company');
const User = require('../models/user');
//tools
const _ = require('lodash');
const Fawn = require('fawn');

//add req.body.profile, req.body.user, /req.body.company after middleware validation - only refactor after writing test
//TODO: create methods to call for updates and deletes to use througout the routes -same for other models

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
}).put(auth.isAuth, async (req,res,next)=>{ 
        const user = req.user;
        let data = req.body;

        let {error} = Company.validateUpdate(data);
        if(error){return  res.status(400).send(error);} //TODO remove because of wrapper
        //add req.body.profile, req.body.user, /req.body.company after middleware validation - only refactor after writing test

        const company = await Company.findById(req.user.company).exec();//find company if existing
        if(!company){return res.status(400).send({message: "Bad request."})}

        data = _.omit(data, ['_id']); //prevent id change
        let result = await Company.findByIdAndUpdate(company._id, data).exec();
        res.status(200).send({message: 'Success', result: result});

//delete user profile info
}).delete(auth.isAuth, async (req,res,next)=>{
        let user = req.user;

        const userExist = await User.findById(user._id).exec();
        if(!userExist) {return res.status(404).send({message: 'Sever error: Could not delete account'});}
        const companyExist = await Company.findById(user.company).exec();
        if(!companyExist) {return res.status(404).send({message: 'Sever error: Could not delete account'});}

        const task = Fawn.Task();
        await task.remove('companies', {_id: userExist.company})
        .remove('users', {_id: userExist._id})
        .run();

        res.status(200).send({message: 'Success'});
});

//Owners
//get company owners
router.route('/me/owner').get(auth.isAuth, async (req,res,next)=>{

        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message: "could not locate profile information"});}

        if(!req.query.id){
                res.status(200).send(company.owner);
        }else{
                let id = req.query.id;
                //validate oject id
                let {error} = Comapny.validateId({id: id});
                if(error){return res.status(400).send(error);}
                //find the owner
                let result = company.owner.find(element=>{
                        if(element._id == id){
                                return element;
                        }
                });

                //return results
                if(!result){ return res.status(404).send({message: 'Invalid ID, or address no longer exist'});}
                res.status(200).send(result);
        }

//add owner 1 by 1 or multiple
}).post(auth.isAuth, async (req,res,next)=>{

        let {error} = Company.validateOwner(req.body);
        if(error){return res.status(400).send({message: 'Bad request.', error: error});}

        //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
        //check if company exist
        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message: "Could not locate company"})}

        //type check on entry
        let owner = req.body.owner;
        //convert to array
        if(!Array.isArray(owner)){
                owner = [owner];
        }
        let result = await Company.updateOne({_id: req.user.company}, {$push:{ owner: {$each: owner, $position: 0, $slice: 30}}}).exec();

        if(result.nModified <= 0){
                res.status(404).send({message: "Could not add owner"});
        }else{
                res.status(200).send(result);
        }

//edit owner 1 by 1
}).put(auth.isAuth, async (req,res,next)=>{

        let {error} = Company.validateOwnerUpdate(req.body);
        if(error){return res.status(400).send({message: 'Bad request.'});}

        if(!req.query.id){
                res.status(400).send({message: "Bad request."});
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}

                //TODO: check if array - for each - update each
                let result = await Company.updateOne({_id: req.user.company, "owner._id": id}, {$set: {"owner.$": req.body}}).exec();

                if(result.nModified <= 0){
                        res.status(404).send({message: "Owner not found."});
                }else{
                        res.status(200).send(result);
                }
        }

//todo delete all or one at a time?
//delete profile address
}).delete(auth.isAuth, async(req,res,next)=>{

        if(!req.query.id){
                res.status(400).send({message: "Bad request."});
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}
                
                let result = await Company.updateOne({_id: req.user.company, "owner._id": id}, {$pull: {owner: {_id: id}}}).exec();

                if(result.nModified <= 0){
                        res.status(404).send({message: "Owner not found."});
                }else{
                        res.status(200).send(result);
                }
        }

});


//TODO: add businesses 
//TODO: crud applicants - on the general side - do not use authentication
//TODO: scout company
//TODO: scout applicants
//TODO: crud employees

module.exports = router;