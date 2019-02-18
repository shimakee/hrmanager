const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
//models
const Company = require('../models/company');
const User = require('../models/user');
const Business = require('../models/business');
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
        let  company = await Company.findById(user.company).populate('businesses.business').exec();
        if(!company){return res.status(400).send({message: 'Bad request.'});}//remove error handling because of wrapper?

        //change _ method to pick instead of omit
        company = _.pick(company.toObject(), ['tradename', 'ownershipType', 'owner', 'businesses', 'pics', 'companyPicName', 'contact', 'emai', 'address', 'government', 'applicants', 'employees']);//remove important properties
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

//delete company info
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


//get company address
router.route('/me/address').get(auth.isAuth, async (req,res,next)=>{

        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message: "could not locate company information"});}
    
        if(!req.query.id){
            res.status(200).send(company.address);
        }else{
            let id = req.query.id;
    
            let {error} = Company.validateId({id: id});
            if(error){return res.status(400).send(error);}
    
            let result = company.address.find(element=>{
                if(element._id == id){
                    return element;
                }
            });
    
            if(!result){
                return res.status(404).send({message: 'Invalid ID, or address no longer exist'});
            }
    
            res.status(200).send(result);
        }
    
    //add company address 1 by 1 or multiple
    }).post(auth.isAuth, async (req,res,next)=>{
    
        //TODO: company validation - import from profile
        let {error} = Company.validateAddress(req.body);
        if(error){return res.status(400).send({message: 'Bad request.', error: error});}
    
        //check profile exist
        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message:"Could not locate company"})}
    
        if(req.body.main == true){//set everything else to false
            // task.update("profiles", {_id: req.user.profile}, {$set: {"address.$[].main": false}});
            await Company.updateOne({_id: req.user.company}, {$set: {"address.$[].main": false}}).exec();
        }
    
        // let address = req.body.address
        // //check if array
        // if(!Array.isArray(req.body.address)){
        //         address = [address]
        // }

        //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
        //if address length is 0 make this entry true
        company = await Company.updateOne({_id: req.user.company}, {$push: {address: {$each:[req.body], $position: 0, $slice: 3}}}).exec();
        // let profile = await task.run({useMongoose: true});
    
        if(company.nModified <= 0){
            res.status(404).send({message: "Could not add address"});
        }else{
            res.status(200).send(company);
        }
    
    //edit profile address
    }).put(auth.isAuth, async (req,res,next)=>{
    
        let {error} = Company.validateAddress(req.body);
        if(error){return res.status(400).send({message: 'Bad request.'});}
    
        if(!req.query.id){
            res.status(400).send({message: "Bad request."});
        }else{
            let id = req.query.id;
    
            let {error} = Company.validateId({id: id});
            if(error){return res.status(400).send(error);}
    
            if(req.body.main == true){//set everything else to false
                await Company.updateOne({_id: req.user.company}, {$set: {"address.$[].main": false}}).exec();
            }
            
            let result = await Company.updateOne({_id: req.user.company, "address._id": id}, {$set: {"address.$": req.body}}).exec();
    
            if(result.nModified <= 0){
                res.status(404).send({message: "Address not found."});
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
            
            let result = await Company.updateOne({_id: req.user.company, "address._id": id}, {$pull: {address: {_id: id}}}).exec();
    
            if(result.nModified <= 0){
                res.status(404).send({message: "Address not found."});
            }else{
                res.status(200).send(result);
            }
        }
        
    });


//return all contacts or just 1 by query param id
router.route('/me/contact').get(auth.isAuth, async (req,res,next)=>{

        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message: "could not locate company information"});}

        if(!req.query.id){
                res.status(200).send(company.contact);
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}

                let result = company.contact.find(element=>{
                if(element._id == id){
                        return element;
                }
                });

                if(!result){
                        return res.status(404).send({message: 'Invalid ID, or contact no longer exist'});
                }

                res.status(200).send(result);
        }

        //add contact 1 by 1
}).post(auth.isAuth, async (req, res, next)=>{

        //validate
        let {error} = Company.validateContact(req.body);
        if(error){return res.status(400).send({message: 'Bad request. Invalid Contact'});}

        if(req.body.main == true){//set everything else to false if adding a main contact
                await Company.updateOne({_id: req.user.comapny}, {$set: {"contact.$[].main": false}}).exec();
        }

        //OPTIONAL: before adding check contact length and deny add instead of slicing and auto deleting last entry
        //add contact
        let company = await Company.updateOne({_id: req.user.company}, {$push:{ contact: {$each:[req.body], $position: 0, $slice: 3}}}).exec();
        // let company = await task.run({useMongoose: true});

        let companyInfo = await Company.findById({_id: req.user.company}).exec();
        let contactMain = companyInfo.contact.find(element=>{//check that there is atleast One main contact
                return element.main == true;
        });

        if(!contactMain){ //no main contact - set position 0 as main
                await Company.updateOne({_id: req.user.company}, {$set: {"contact.0.main": true}}).exec();
        }

        if(company.nModified <= 0){
                res.status(404).send({message: "could not add"});
        }else{
                res.status(200).send(company);
        }

        //edit contact  by query param id
}).put(auth.isAuth, async (req, res,next)=>{

        let {error} = Company.validateContact(req.body);
        if(error){return res.status(400).send({message: 'Bad request.', error: error});}

        if(!req.query.id){
                res.status(400).send({message: "Bad request. no query id."});
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}

                if(req.body.main == true){//set everything else to false
                        await Company.updateOne({_id: req.user.company}, {$set: {"contact.$[].main": false}}).exec();
                }
                
                let result = await Company.updateOne({_id: req.user.company, "contact._id": id}, {$set: {"contact.$": req.body}}).exec();

                let companyInfo = await Company.findById({_id: req.user.company}).exec();
                let contactMain = companyInfo.contact.find(element=>{//check that there is atleast One main contact
                        return element.main == true;
                });

                if(!contactMain){ //no main contact - set position 0 as main
                        await Company.updateOne({_id: req.user.company}, {$set: {"contact.0.main": true}}).exec();
                }

                if(result.nModified <= 0){
                        res.status(404).send({message: "Contact not found."});
                }else{
                        res.status(200).send(result);
                }
        }

        //delete contact by query param id
}).delete(auth.isAuth, async (req, res, next)=>{

        if(!req.query.id){
                res.status(400).send({message: "Bad request."});
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}
                
                let result = await Company.updateOne({_id: req.user.company, "contact._id": id}, {$pull: {contact: {_id: id}}}).exec();

                let companyInfo = await Company.findById({_id: req.user.company}).exec();
                let contactMain = companyInfo.contact.find(element=>{//check that there is atleast One main contact
                        return element.main == true;
                });

                if(!contactMain){ //no main contact - set position 0 as main
                        await Company.updateOne({_id: req.user.company}, {$set: {"contact.0.main": true}}).exec();
                }

                if(result.nModified <= 0){
                        res.status(404).send({message: "Contact not found."});
                }else{
                        res.status(200).send(result);
                }
        }
});


//get all government related informations or by req query  - id
router.route('/me/gov').get(auth.isAuth, async (req,res,next)=>{

        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message: "could not locate company information"});}
    
        if(!req.query.id){
            res.status(200).send(company.government);
        }else{
            let id = req.query.id;
    
            let {error} = Company.validateId({id: id});
            if(error){return res.status(400).send(error);}
    
            let result = company.government.find(element=>{
                if(element._id == id){
                    return element;
                }
            });
    
            if(!result){
                return res.status(404).send({message: 'Invalid ID, or information no longer exist'});
            }else{
                    res.status(200).send(result);
            }
    
        }
    
    //add government info 1 by 1
    }).post(auth.isAuth, async (req,res,next)=>{
    
        //validate
        let {error} = Company.validateGov(req.body);
        if(error){return res.status(400).send({message: 'Bad request. Invalid information'});}

        //check that company exist
    
        //OPTIONAL: before adding check contact length and deny add instead of slicing and auto deleting last entry
        //add information
        let company = await Company.updateOne({_id: req.user.company}, {$push:{ government: {$each:[req.body], $position: 0, $slice: 10}}}).exec();
        // let company = await task.run({useMongoose: true});
    
        if(company.nModified <= 0){
            res.status(404).send({message: "could not add"});
        }else{
            res.status(200).send(company);
        }
    
        //delete government info by req query - id
    }).put(auth.isAuth, async(req,res,next)=>{
    
        let {error} = Company.validateGov(req.body);
        if(error){
            return res.status(400).send({message: 'Bad request.'});}
    
        if(!req.query.id){
            res.status(400).send({message: "Bad request."});
        }else{
            let id = req.query.id;
    
            let {error} = Company.validateId({id: id});
            if(error){return res.status(400).send(error);}

            //check that company exist
    
            let result = await Company.updateOne({_id: req.user.company, "government._id": id}, {$set: {"government.$": req.body}}).exec();
    
            if(result.nModified <= 0){
                res.status(404).send({message: "Information not found."});
            }else{
                res.status(200).send(result);
            }
        }
    
        //delete government information
    }).delete(auth.isAuth, async(req,res,next)=>{
    
        if(!req.query.id){
            res.status(400).send({message: "Bad request."});
        }else{
            let id = req.query.id;
    
            let {error} = Company.validateId({id: id});
            if(error){return res.status(400).send(error);}

            //check that company exist
            
            let result = await Company.updateOne({_id: req.user.company, "government._id": id}, {$pull: {government: {_id: id}}}).exec();
    
            if(result.nModified <= 0){
                res.status(404).send({message: "Information not found."});
            }else{
                res.status(200).send(result);
            }
        }
    });

//get profile email
router.route('/me/email').get(auth.isAuth, async (req,res,next)=>{

        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message: "could not locate company information"});}

        if(!req.query.id){
                res.status(200).send(company.email);
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}

                let result = company.email.find(element=>{
                if(element._id == id){
                        return element;
                }
                });

                if(!result){
                        return res.status(404).send({message: 'Invalid ID, or email no longer exist'});
                }else{
                        res.status(200).send(result);
                }

        }

        //add profile email 1 by 1
}).post(auth.isAuth, async (req,res,next)=>{

        let {error} = Company.validateEmail(req.body);
        if(error){return res.status(400).send({message: 'Bad request.'});}

        //check profile exist
        let company = await Company.findById(req.user.company).exec();
        if(!company){return res.status(404).send({message:"Could not locate company"})}

        if(req.body.main == true || req.body.main == "true"){//set everything else to false
                // task.update("companys", {_id: req.user.company}, {$set: {"address.$[].main": false}});
                await Company.updateOne({_id: req.user.company}, {$set: {"email.$[].main": false}}).exec();
        }


        //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
        company = await Company.updateOne({_id: req.user.company}, {$push:{ email: {$each: [req.body], $position: 0, $slice: 3}}}).exec();
        // let company = await task.run({useMongoose: true});

        if(company.nModified <= 0){
                res.status(404).send({message: "Could not add email"});
        }else{
                res.status(200).send(company);
        }

        //edit profile email
}).put(auth.isAuth, async (req,res,next)=>{

        let {error} = Company.validateEmail(req.body);
        if(error){
                return res.status(400).send({message: 'Bad request.'});}

        if(!req.query.id){
                res.status(400).send({message: "Bad request."});
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}

                //check that company exist

                if(req.body.main == true || req.body.main == "true"){//set everything else to false
                        await Company.updateOne({_id: req.user.company}, {$set: {"email.$[].main": false}}).exec();
                }
                
                let result = await Company.updateOne({_id: req.user.company, "email._id": id}, {$set: {"email.$": req.body}}).exec();

                if(result.nModified <= 0){
                res.status(404).send({message: "email not found."});
                }else{
                res.status(200).send(result);
                }
        }

        //todo delete all or one at a time?
        //delete company email
}).delete(auth.isAuth, async(req,res,next)=>{

        if(!req.query.id){
                res.status(400).send({message: "Bad request."});
        }else{
                let id = req.query.id;

                let {error} = Company.validateId({id: id});
                if(error){return res.status(400).send(error);}

                //check that company exist
                
                let result = await Company.updateOne({_id: req.user.company, "email._id": id}, {$pull: {email: {_id: id}}}).exec();

                if(result.nModified <= 0){
                        res.status(404).send({message: "email not found."});
                }else{
                        res.status(200).send(result);
                }
        }

});

//Owners==================================OWNERS
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

                //TODO: check that  the owner is there

                //TODO: check if array - for each - update each
                let result = await Company.updateOne({_id: req.user.company, "owner._id": id}, {$set: {"owner.$": req.body}}).exec();

                if(result.nModified <= 0){
                        res.status(404).send({message: "Owner not found."});
                }else{
                        res.status(200).send(result);
                }
        }

//todo delete all or one at a time?
//delete company owner
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


// //scout company - //moved to employment
// router.get('/find').get(auth.isAuth, async (req,res,next)=>{
//         let queryId = req.query.id; //search by id
//         let queryName = req.query.name; //search by name
//         let company;
        
//         if(!queryId && !queryName){
//                 company = await Company.find().exec();
//                 if(!company){return res.status(404).send({message: "could not locate any ompany information"});}

//                 // res.status(200).send(_.pick(company, ['authenticated', 'tradename', 'ownershipType', 'email', 'contact', 'address', 'businesses', 'government']));
//         }else if(queryId){
//                 let {error} = Company.validateId({id: queryId});
//                 if(error){return res.status(400).send(error);}

                
//                 company = await Company.findById(queryId).exec();
//                 if(!company){return res.status(404).send({message: "could not locate company information by id"});}

//                 // res.status(200).send(_.pick(company, ['authenticated', 'tradename', 'ownershipType', 'email', 'contact', 'address', 'businesses', 'government']));
//         }else if(queryName){
//                 // let {error} = Company.validateId({id: id});//TODO: validate
//                 // if(error){return res.status(400).send(error);}

//                 company = await Company.find({tradename:  new RegExp(queryName, "i")}).exec();
//                 if(!company){return res.status(404).send({message: "could not locate company information by tradename"});}

//         }
//         let results = [];
//         const companyProperties = ['authenticated','tradename', 'ownershipType', 'contact', 'address', 'email', 'contact', 'businesses', 'pics']

//         if(Array.isArray(company)){
//                 company.forEach(element => {
//                         let result = _.pick(element,companyProperties);
//                         results.push(result);
//                 });
//         }else{
//                 let result = _.pick(company,companyProperties);
//                 results.push(result);
//         }
        
//         res.status(200).send(results);
// });

//TODO: post a job
//TODO: crud employees
//TODO: rud applicants - read, update - remarks & hire, delete, move to pool - reject (or keep for hiring pool),

//on the general side - do not use authentication 
//TODO: c applicants - profiles applying to company
//TODO: scout company  -get request for all companies to be view by profile
//TODO: scout applicants - get request on profiles to be viewed by companies

//employment - last feature 
//work started - work -ended - w/ reason and other employment details
//future features - like salary - location assignment - promotion - memos

module.exports = router;