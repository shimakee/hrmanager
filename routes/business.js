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
const tools = require('../util/tools');
const validate = tools.validate;


//Business==================================BUSINESS
//get company business
router.route('/me').get(auth.isAuth, async (req,res,next)=>{

    let company = await Company.findById(req.user.company).populate('businesses.business').exec();
    if(!company){return res.status(404).send({message: "could not locate company information"});}

    if(!req.query.id){
            res.status(200).send(company.businesses);
    }else{
            let id = req.query.id;
            //validate oject id
            let {error} = Comapny.validateId({id: id});
            if(error){return res.status(400).send(error);}
            //find the business
            let result = company.businesses.find(element=>{
                    if(element._id == id){
                            return element;
                    }
            });

            //return results
            if(!result){ return res.status(404).send({message: 'Invalid ID, or business no longer exist'});}
            res.status(200).send(result);
    }

//add business 1 by 1 or multiple
}).post(auth.isAuth, async (req,res,next)=>{

    let {error} = validate.isObjectId(req.body);
    if(error){return res.status(400).send({message: 'Bad request.', error: error});}

    //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
    //check if company exist
    let company = await Company.findById(req.user.company).exec();
    if(!company){return res.status(404).send({message: "Could not locate company"})}

    let business = req.body;
    let newBusiness = new Business(business);
    //assign business company id
    newBusiness.company = company._id;

    const task = Fawn.Task();

    task.save('businesses', newBusiness);
    business = {business: newBusiness._id}
    task.update('companies', {_id: company._id}, {$push:{ businesses: {$each: [business], $position: 0, $slice: 50}}});
    await task.run();

    res.status(200).send({message: "Success"});

//edit business 1 by 1
}).put(auth.isAuth, async (req,res,next)=>{

    let {error} = Business.validate(req.body);
    if(error){return res.status(400).send({message: 'Bad request.'});}

    if(!req.query.id){
            res.status(400).send({message: "Bad request."});
    }else{
            let id = req.query.id;

            //should be a general tool for validation
            let {error} = validate.isObjectId({id: id});
            if(error){return res.status(400).send(error);}

            //check that the business is there
            let business = await Business.findByIdAndUpdate(id, req.body).exec();
            if(!business){return res.status(404).send({message: " could not find business."});}

            res.status(200).send(business);
    }

//todo delete all or one at a time?
//delete profile address
}).delete(auth.isAuth, async(req,res,next)=>{

    if(!req.query.id){
            res.status(400).send({message: "Bad request."});
    }else{
            let id = req.query.id;

            let {error} = validate.isObjectId({id: id});
            if(error){return res.status(400).send(error);}

            let business = await Business.findById(id).exec();
            if(!business){return res.status(404).send({message: "Could not locate business"})}

            let company = await Company.findById(req.user.company).exec();
            if(!company){ return res.status(404).send({message:"COmpany does not exist"})}
            
            const task = Fawn.Task();
            task.update('companies', {_id: company._id, "businesses.business": business._id}, {$pull: {businesses: {business: business._id}}});
            task.remove('businesses', {_id: business._id});
            task.run()
                    .then((result)=>{
                            res.status(200).send({message:"success", result: result});
                    }, (err)=>{
                            res.status(200).send({message:"success", err: err});
                    });
    }

});

//get business email
router.route('/me/email').get(auth.isAuth, async (req,res,next)=>{
    //check that company exist
    let company = await Company.findById(req.user.company).exec();
    if(!company){return res.status(404).send({message: "could not locate company information"});}

    //check that there is businessid passed
    if(!req.query.businessId){return res.status(400).send({message:"bad request"});}
    const businessId = req.query.businessId;
    //check taht object id is valid
    let {error} = validate.isObjectId({id: businessId});
    if(error){return res.status(400).send(error);}
    
    //check that company exist & that business id is inside company
    let result = company.businesses.find(element=>{
            if(element.business == businessId){
                    return element;
            }
    });
    if(!result){return res.status(401).send({message:"Business does not belong to you", result: company})} //return unauthorized

    let business = await Business.findById(businessId).exec();
    if(!business){return res.status(404).send({message: "could not locate business information"});}
    
    if(!req.query.emailId){
            res.status(200).send(business.email);
    }else{
            const emailId = req.query.emailId;
            
            let isId = validate.isObjectId({id: emailId});
            if(isId.error){return res.status(400).send(error);}
            

            let businessResult = business.email.find(element=>{
                    if(element._id == emailId){
                            return element;
                    }
            });

            if(!businessResult){
                    return res.status(404).send({message: 'Invalid ID, or email no longer exist'});
            }else{
                    res.status(200).send(businessResult);
            }

    }

    //add business email 1 by 1
}).post(auth.isAuth, async (req,res,next)=>{
    let email = req.body.email;
    let businessId = req.query.businessId

    if(!businessId){return res.status(400).send({message:"bad request"})}

    //validate input
    let {error} = validate.email(email, Business.emailLimit);
            if(error){return res.status(400).send({message: 'Bad request..', error: error});}
    //validate object id
    let result = validate.isObjectId({id: businessId});
            if(result.error){return res.status(400).send({message: 'Bad request.', error: result.error});}

    //check company exist
    let company = await Company.findById(req.user.company).exec();
            if(!company){return res.status(404).send({message:"Could not locate company"})}

    //check that company exist & that business id is inside company
    let inCompany = company.businesses.find(element=>{
            if(element.business == businessId){
                    return element;
            }
    });
    if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized

    //check business exist
    let business = await Business.findById(businessId).exec();
            if(!business){return res.status(404).send({message:"Could not locate business"})}

    if(email.main == true || email.main == "true"){//set everything else to false
            // task.update("companys", {_id: req.user.company}, {$set: {"address.$[].main": false}});
            await Business.updateOne({_id: businessId}, {$set: {"email.$[].main": false}}).exec();
    }

    //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
    business = await Business.updateOne({_id: businessId}, {$push:{ email: {$each: [email], $position: 0, $slice: 3}}}).exec();
    // let company = await task.run({useMongoose: true});

    if(business.nModified <= 0){
            res.status(404).send({message: "Could not add email"});
    }else{
            res.status(200).send(business);
    }

    //edit business email
}).put(auth.isAuth, async (req,res,next)=>{
    let email = req.body;
    const businessId= req.query.businessId;
    const emailId= req.query.emailId;

    //validate input
    let {error} = validate.email(email, Business.emailLimit);
    if(error){return res.status(400).send({message: 'Bad request.'});}
    //check required ids exist
    if(!emailId || !businessId){
            res.status(400).send({message: "Bad request."});
    }else{
            //validate id is an object id
            let isBusinessId = validate.isObjectId({id: businessId});
                    if(isBusinessId.error){return res.status(400).send({message:"bad request"});}
            let isEmailId = validate.isObjectId({id: emailId});
                    if(isEmailId.error){return res.status(400).send({message:"bad request"});}

            //check company exist
            let company = await Company.findById(req.user.company).exec();
                    if(!company){return res.status(404).send({message:"Could not locate company"})}

            //check that company exist & that business id is inside company
            let inCompany = company.businesses.find(element=>{
                    if(element.business == businessId){
                            return element;
                    }
            });
            if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized


            if(req.body.main == true || req.body.main == "true"){//set everything else to false
                    await Business.updateOne({_id: businessId}, {$set: {"email.$[].main": false}}).exec();
            }
            
            let result = await Business.updateOne({_id: businessId, "email._id": emailId}, {$set: {"email.$": req.body}}).exec();

            if(result.nModified <= 0){
                    res.status(404).send({message: "email not found."});
            }else{
                    res.status(200).send(result);
            }
    }

    //todo delete all or one at a time?
    //delete business email
}).delete(auth.isAuth, async(req,res,next)=>{
    let email = req.body;
    const businessId= req.query.businessId;
    const emailId= req.query.emailId;

    if(!emailId || !businessId){
            res.status(400).send({message: "Bad request."});
    }else{

            let isEmailId = validate.isObjectId({id: emailId});
            if(isEmailId.error){return res.status(400).send({message:"Bad request"});}
            let isBusinessId = validate.isObjectId({id: businessId});
            if(isBusinessId.error){return res.status(400).send({message:"bad request"});}

            //check company exist
            let company = await Company.findById(req.user.company).exec();
                    if(!company){return res.status(404).send({message:"Could not locate company"})}

            //check that company exist & that business id is inside company
            let inCompany = company.businesses.find(element=>{
                    if(element.business == businessId){
                            return element;
                    }
            });
            if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized
            
            //remove email
            let result = await Business.updateOne({_id: businessId, "email._id": emailId}, {$pull: {email: {_id: emailId}}}).exec();

            if(result.nModified <= 0){
                    res.status(404).send({message: "email not found."});
            }else{
                    res.status(200).send(result);
            }
    }

});

//get business contact
router.route('/me/contact').get(auth.isAuth, async (req,res,next)=>{
    //check that company exist
    let company = await Company.findById(req.user.company).exec();
    if(!company){return res.status(404).send({message: "could not locate company information"});}

    //check that there is businessid passed
    if(!req.query.businessId){return res.status(400).send({message:"bad request"});}
    const businessId = req.query.businessId;
    //check taht object id is valid
    let {error} = validate.isObjectId({id: businessId});
    if(error){return res.status(400).send(error);}
    
    //check that company exist & that business id is inside company
    let result = company.businesses.find(element=>{
            if(element.business == businessId){
                    return element;
            }
    });
    if(!result){return res.status(401).send({message:"Business does not belong to you", result: company})} //return unauthorized
    //check that business exist
    let business = await Business.findById(businessId).exec();
    if(!business){return res.status(404).send({message: "could not locate business information"});}
    
    if(!req.query.contactId){
            res.status(200).send(business.contact);
    }else{
            const contactId = req.query.contactId;
            
            let isId = validate.isObjectId({id: contactId});
            if(isId.error){return res.status(400).send(error);}
            

            let businessResult = business.contact.find(element=>{
                    if(element._id == contactId){
                            return element;
                    }
            });

            if(!businessResult){
                    return res.status(404).send({message: 'Invalid ID, or email no longer exist'});
            }else{
                    res.status(200).send(businessResult);
            }

    }

    //add business contact 1 by 1
}).post(auth.isAuth, async (req,res,next)=>{
    let contact = req.body.contact;
    let businessId = req.query.businessId

    if(!businessId){return res.status(400).send({message:"bad request"})}

    //validate input
    let {error} = validate.contact(contact, Business.contactLimit);
            if(error){return res.status(400).send({message: 'Bad request..', error: error});}
    //validate object id
    let result = validate.isObjectId({id: businessId});
            if(result.error){return res.status(400).send({message: 'Bad request.', error: result.error});}

    //check company exist
    let company = await Company.findById(req.user.company).exec();
            if(!company){return res.status(404).send({message:"Could not locate company"})}

    //check that company exist & that business id is inside company
    let inCompany = company.businesses.find(element=>{
            if(element.business == businessId){
                    return element;
            }
    });
    if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized

    //check business exist
    let business = await Business.findById(businessId).exec();
            if(!business){return res.status(404).send({message:"Could not locate business"})}

    if(contact.main == true || contact.main == "true"){//set everything else to false
            // task.update("companys", {_id: req.user.company}, {$set: {"address.$[].main": false}});
            await Business.updateOne({_id: businessId}, {$set: {"contact.$[].main": false}}).exec();
    }

    //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
    business = await Business.updateOne({_id: businessId}, {$push:{ contact: {$each: [contact], $position: 0, $slice: 3}}}).exec();
    // let company = await task.run({useMongoose: true});

    if(business.nModified <= 0){
            res.status(404).send({message: "Could not add contact"});
    }else{
            res.status(200).send(business);
    }

    //edit business contact
}).put(auth.isAuth, async (req,res,next)=>{
    let contact = req.body.contact;
    const businessId= req.query.businessId;
    const contactId= req.query.contactId;

    //validate input
    let {error} = validate.contact(contact, Business.contactLimit);
    if(error){return res.status(400).send({message: 'Bad request.'});}
    //check required ids exist
    if(!contactId || !businessId){
            res.status(400).send({message: "Bad request."});
    }else{
            //validate id is an object id
            let isBusinessId = validate.isObjectId({id: businessId});
                    if(isBusinessId.error){return res.status(400).send({message:"bad request"});}
            let isContactId = validate.isObjectId({id: contactId});
                    if(isContactId.error){return res.status(400).send({message:"bad request"});}

            //check company exist
            let company = await Company.findById(req.user.company).exec();
                    if(!company){return res.status(404).send({message:"Could not locate company"})}

            //check that company exist & that business id is inside company
            let inCompany = company.businesses.find(element=>{
                    if(element.business == businessId){
                            return element;
                    }
            });
            if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized


            if(contact.main == true || contact.main == "true"){//set everything else to false
                    await Business.updateOne({_id: businessId}, {$set: {"contact.$[].main": false}}).exec();
            }
            
            let result = await Business.updateOne({_id: businessId, "contact._id": contactId}, {$set: {"contact.$": contact}}).exec();

            if(result.nModified <= 0){
                    res.status(404).send({message: "contact not found."});
            }else{
                    res.status(200).send(result);
            }
    }

    //todo delete all or one at a time?
    //delete company contact
}).delete(auth.isAuth, async(req,res,next)=>{
    let contact = req.body;
    const businessId= req.query.businessId;
    const contactId= req.query.contactId;

    if(!contactId || !businessId){
            res.status(400).send({message: "Bad request."});
    }else{

            let isContactId = validate.isObjectId({id: contactId});
            if(isContactId.error){return res.status(400).send({message:"Bad request"});}
            let isBusinessId = validate.isObjectId({id: businessId});
            if(isBusinessId.error){return res.status(400).send({message:"bad request"});}

            //check company exist
            let company = await Company.findById(req.user.company).exec();
                    if(!company){return res.status(404).send({message:"Could not locate company"})}

            //check that company exist & that business id is inside company
            let inCompany = company.businesses.find(element=>{
                    if(element.business == businessId){
                            return element;
                    }
            });
            if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized
            
            //remove Contact
            let result = await Business.updateOne({_id: businessId, "contact._id": contactId}, {$pull: {contact: {_id: contactId}}}).exec();

            if(result.nModified <= 0){
                    res.status(404).send({message: "contact not found."});
            }else{
                    res.status(200).send(result);
            }
    }

});


//get business government
router.route('/me/government').get(auth.isAuth, async (req,res,next)=>{
    //check that company exist
    let company = await Company.findById(req.user.company).exec();
    if(!company){return res.status(404).send({message: "could not locate company information"});}

    //check that there is businessid passed
    if(!req.query.businessId){return res.status(400).send({message:"bad request"});}
    const businessId = req.query.businessId;
    //check taht object id is valid
    let {error} = validate.isObjectId({id: businessId});
    if(error){return res.status(400).send(error);}
    
    //check that company exist & that business id is inside company
    let result = company.businesses.find(element=>{
            if(element.business == businessId){
                    return element;
            }
    });
    if(!result){return res.status(401).send({message:"Business does not belong to you", result: company})} //return unauthorized
    //check that business exist
    let business = await Business.findById(businessId).exec();
    if(!business){return res.status(404).send({message: "could not locate business information"});}
    
    if(!req.query.governmentId){
            res.status(200).send(business.government);
    }else{
            const governmentId = req.query.governmentId;
            
            let isId = validate.isObjectId({id: governmentId});
            if(isId.error){return res.status(400).send(error);}
            

            let businessResult = business.government.find(element=>{
                    if(element._id == governmentId){
                            return element;
                    }
            });

            if(!businessResult){
                    return res.status(404).send({message: 'Invalid ID, or email no longer exist'});
            }else{
                    res.status(200).send(businessResult);
            }

    }

    //add business government 1 by 1
}).post(auth.isAuth, async (req,res,next)=>{
    let government = req.body.government;
    let businessId = req.query.businessId

    if(!businessId){return res.status(400).send({message:"bad request"})}

    //validate input
    let {error} = validate.government(government, Business.governmentLimit);
            if(error){return res.status(400).send({message: 'Bad request..', error: error});}
    //validate object id
    let result = validate.isObjectId({id: businessId});
            if(result.error){return res.status(400).send({message: 'Bad request.', error: result.error});}

    //check company exist
    let company = await Company.findById(req.user.company).exec();
            if(!company){return res.status(404).send({message:"Could not locate company"})}

    //check that company exist & that business id is inside company
    let inCompany = company.businesses.find(element=>{
            if(element.business == businessId){
                    return element;
            }
    });
    if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized

    //check business exist
    let business = await Business.findById(businessId).exec();
            if(!business){return res.status(404).send({message:"Could not locate business"})}

    if(government.main == true || government.main == "true"){//set everything else to false
            // task.update("companys", {_id: req.user.company}, {$set: {"address.$[].main": false}});
            await Business.updateOne({_id: businessId}, {$set: {"government.$[].main": false}}).exec();
    }

    //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
    business = await Business.updateOne({_id: businessId}, {$push:{ government: {$each: [government], $position: 0, $slice: 3}}}).exec();
    // let company = await task.run({useMongoose: true});

    if(business.nModified <= 0){
            res.status(404).send({message: "Could not add government"});
    }else{
            res.status(200).send(business);
    }

    //edit business government
}).put(auth.isAuth, async (req,res,next)=>{
    let government = req.body.government;
    const businessId= req.query.businessId;
    const governmentId= req.query.governmentId;

    //validate input
    let {error} = validate.government(government, Business.governmentLimit);
    if(error){return res.status(400).send({message: 'Bad request.'});}
    //check required ids exist
    if(!governmentId || !businessId){
            res.status(400).send({message: "Bad request."});
    }else{
            //validate id is an object id
            let isBusinessId = validate.isObjectId({id: businessId});
                    if(isBusinessId.error){return res.status(400).send({message:"bad request"});}
            let isGovernment = validate.isObjectId({id: governmentId});
                    if(isGovernment.error){return res.status(400).send({message:"bad request"});}

            //check company exist
            let company = await Company.findById(req.user.company).exec();
                    if(!company){return res.status(404).send({message:"Could not locate company"})}

            //check that company exist & that business id is inside company
            let inCompany = company.businesses.find(element=>{
                    if(element.business == businessId){
                            return element;
                    }
            });
            if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized


            if(government.main == true || government.main == "true"){//set everything else to false
                    await Business.updateOne({_id: businessId}, {$set: {"government.$[].main": false}}).exec();
            }
            
            let result = await Business.updateOne({_id: businessId, "government._id": governmentId}, {$set: {"government.$": government}}).exec();

            if(result.nModified <= 0){
                    res.status(404).send({message: "government not found."});
            }else{
                    res.status(200).send(result);
            }
    }

    //todo delete all or one at a time?
    //delete business government
}).delete(auth.isAuth, async(req,res,next)=>{
    let government = req.body;
    const businessId= req.query.businessId;
    const governmentId= req.query.governmentId;

    if(!governmentId || !businessId){
            res.status(400).send({message: "Bad request."});
    }else{

            let isGovernmentId = validate.isObjectId({id: governmentId});
            if(isGovernmentId.error){return res.status(400).send({message:"Bad request"});}
            let isBusinessId = validate.isObjectId({id: businessId});
            if(isBusinessId.error){return res.status(400).send({message:"bad request"});}

            //check company exist
            let company = await Company.findById(req.user.company).exec();
                    if(!company){return res.status(404).send({message:"Could not locate company"})}

            //check that company exist & that business id is inside company
            let inCompany = company.businesses.find(element=>{
                    if(element.business == businessId){
                            return element;
                    }
            });
            if(!inCompany){return res.status(401).send({message:"Business does not belong to you"})} //return unauthorized
            
            //remove government
            let result = await Business.updateOne({_id: businessId, "government._id": governmentId}, {$pull: {government: {_id: governmentId}}}).exec();

            if(result.nModified <= 0){
                    res.status(404).send({message: "government not found."});
            }else{
                    res.status(200).send(result);
            }
    }

});


module.exports = router;