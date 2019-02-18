const   express = require('express'),
        router = express.Router({mergeParams: true});

const auth = require('../middleware/auth');
//models
const Company = require('../models/company');
const User = require('../models/user');
const Business = require('../models/business');
const Profile = require('../models/profile');
const Employee = require('../models/employee');
//tools
const _ = require('lodash');
const Fawn = require('fawn');
const tools = require('../util/tools');
const validate = tools.validate;
const moment = require('moment');


//profile - scout company all or by query.companyId or by company tradename
router.get('/scout/company').get(auth.isAuth, async (req,res,next)=>{
        let queryId = req.query.id; //search by id
        let queryName = req.query.name; //search by name
        let company;
        
        if(!queryId && !queryName){
                company = await Company.find().exec();
                if(!company){return res.status(404).send({message: "could not locate any ompany information"});}

                // res.status(200).send(_.pick(company, ['authenticated', 'tradename', 'ownershipType', 'email', 'contact', 'address', 'businesses', 'government']));
        }else if(queryId){
                let {error} = Company.validateId({id: queryId});
                if(error){return res.status(400).send(error);}

                
                company = await Company.findById(queryId).exec();
                if(!company){return res.status(404).send({message: "could not locate company information by id"});}

                // res.status(200).send(_.pick(company, ['authenticated', 'tradename', 'ownershipType', 'email', 'contact', 'address', 'businesses', 'government']));
        }else if(queryName){
                // let {error} = Company.validateId({id: id});//TODO: validate
                // if(error){return res.status(400).send(error);}

                company = await Company.find({tradename:  new RegExp(queryName, "i")}).exec();
                if(!company){return res.status(404).send({message: "could not locate company information by tradename"});}

        }
        let results = [];
        const companyProperties = ['_id','authenticated','tradename', 'ownershipType', 'contact', 'address', 'email', 'contact', 'businesses', 'pics']

        if(Array.isArray(company)){
                company.forEach(element => {
                        let result = _.pick(element,companyProperties);
                        results.push(result);
                });
        }else{
                let result = _.pick(company,companyProperties);
                results.push(result);
        }
        
        res.status(200).send(results);
});

//profile - apply company - change url or read body for status of application?
router.route('/me/apply').post(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

        const profileId = req.user.profile; 
        let companyId;
        if(req.body){
                companyId = req.body.companyId;
        }else if(req.query){
                companyId = req.query.companyId;
        }

        //check that an id is passed
        if(companyId){

                //check that query id is a valid object id
                if(!validate.isObjectId(companyId)){return res.status(400).send({message: 'Invalid query id passed'});}

                //check that company exist
                let company = await Company.findById(companyId).exec();
                if(!company){return res.status(400).send({message: 'Bad request'});}
                
                //check that you are not yet applied or hired into the company
                let employee = await Employee.findOne({company: companyId, profile: profileId}).exec();
                let employeeId;

                //create applied date now
                let now = new Date(Date.now());
                let appliedInfo = {_id: tools.get.objectId().toString(), class: "applied", date: now}

                //start a task
                let task = Fawn.Task();

                if(employee){
                        //check status if hired or applied
                        if(employee.status == "applied" || employee.status == "hired" || employee.status == 'recruited' || employee.status == 'accepted'){
                                return res.status(400).send({message:`You are already ${employee.status} within the company`});

                        //change status into applied & application information date
                        }else{

                                employee.status = "applied"
                                employee.infoDate.unshift(appliedInfo); // make it to a task?... for position 0?

                                task.update('employees', {_id: employee._id}, {$set: employee});
                                employeeId = employee._id;
                        }
                }else{
                        //create employment - with profile and company id
                        let newRecord = {
                                status: 'applied',
                                company: companyId,
                                profile: profileId,
                                infoDate:[appliedInfo]
                        }

                        //validate record
                        let {error} = Employee.validate(newRecord);
                        if(error){return res.status(400).send({message: 'Bad request, Inserting record', error: error});}

                        let newEmployee = new Employee(newRecord);

                        //save employee
                        task.save('employees', newEmployee);
                        employeeId = newEmployee._id;
                }

                //check that id does not exist already in company
                let resultCompany = company.employees.find(el=>{
                        if(String(el.employee) == String(employeeId)){
                                return el;
                        }
                });

                //check that id does not exist already in User account
                let user = await User.findOne({profile: profileId}).exec();

                let resultUser = user.employment.find(el=>{
                        if(String(el._id) == String(employeeId)){
                                return el;
                        }
                });
                
                
                
                //if employee doesnt exist already
                if(!resultCompany){
                        //add to company - employees - as applicant
                        task.update('companies', {_id: company._id}, {$push:{ employees: {$each: [{employee: employeeId}], $position: 0, $slice: 50}}});
                }

                //if employee doesnt exist already
                if(!resultUser){
                        //add to user - employment 
                        task.update('users', {_id: user._id}, {$push:{ employment: {$each: [{_id: employeeId}], $position: 0, $slice: 50}}});
                }

                //run tasks
                task.run()
                .then((result)=>{
                        res.status(200).send({message: "Success", result: result});
                }, (error)=>{
                        res.status(500).send({message: "Failed", error: error});
                });

        }else{
                res.status(400).send({message: "require a query id of the company"});
        }

//profile - cancel application
}).put(auth.isAuth, auth.isAccountType('profile'), async(req,res,next)=>{

        if(!req.query.companyId){return res.status(400).send({message: "No query id passed"})}

        const companyId = req.query.companyId;
        const profileId = req.user.profile;

        //check that employment exist
        let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
        if(!employment){ return res.status(404).send({message: "Could not locate employment.", result: employment, company: companyId, profile: profileId});}

        //check employement status - if applied continue
        if(employment.status == 'applied'  || employment.status == 'accepted'){

                //run task
                let task = Fawn.Task();

                //change status into cancelled
                task.update('employees', {_id: employment._id}, {$set: {status: 'cancelled'}});

                //create applied date now
                let now = new Date(Date.now());
                let info = {_id: tools.get.objectId(), class: "cancelled", date: now}

                //push infoDate status - cancelled
                task.update('employees', {_id: employment._id}, {$push: {infoDate: {$each:[info], $position:0}}});

                //check user exist
                const user = await User.findById(req.user._id).exec();
                //run as task - pull from employment under user
                task.update('users', {_id:user._id}, {$pull: {employment: {_id: employment._id}}});

                //check company exist
                const company = await Company.findById(companyId).exec();
                //run as task - pull from employment under company
                task.update('companies', {_id: company._id}, {$pull: {employees: {employee: employment._id}}});

                task.run().then((result)=>{

                        return res.status(200).send(result);
                }, (error)=>{
                        
                        return res.status(200).send(error);
                });

        //else if hired- you are already employed within the company
        }else if(employment.status == 'hired'){

                return res.status(400).send({message:'Status already hired.'});
        //else - you are not applied within the company
        }else{
                return res.status(400).send({message:'You are not applied within the company'});
        }
});

//decline/accept recruitment by company
router.route('/me/recruit/:status').post(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

        if(!req.query.companyId){return res.status(400).send({message: "No query id passed"})}

        const companyId = req.query.companyId;
        const profileId = req.user.profile;
        const status = req.params.status;

        //check that employment exist
        let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
        if(!employment){ return res.status(404).send({message: "Could not locate employment.", result: employment, company: companyId, profile: profileId});}

        //check employement status - if recruited continue
        if(employment.status == 'recruited'){

                //run task
                let task = Fawn.Task();

                //check that status is valid
                // if(!Employee.isValidStatus(status)){ return res.status(400).send({message:'invalid url status'})}
                if(status == 'accepted' || status == 'declined'){

                        
                        //change status into cancelled
                        task.update('employees', {_id: employment._id}, {$set: {status: status}});
                        
                        //create applied date now
                        let now = new Date(Date.now());
                        let info = {_id: tools.get.objectId(), class: status, date: now}
                        
                        //push infoDate status - cancelled
                        task.update('employees', {_id: employment._id}, {$push: {infoDate: {$each:[info], $position:0}}});
                }
                
                //check user exist
                const user = await User.findById(req.user._id).exec();
                //check company exist
                const company = await Company.findById(companyId).exec();

                //remove employment from company and user upon decline
                if(status == 'declined'){

                        //run as task - pull from employment under user
                        task.update('users', {_id:user._id}, {$pull: {employment: {_id: employment._id}}});
                        
                        //run as task - pull from employment under company
                        task.update('companies', {_id: company._id}, {$pull: {employees: {employee: employment._id}}});

                //add employment to company and user upon accept
                }else if(status == 'accepted'){

                        //check that id does not exist already in company
                        let resultCompany = company.employees.find(el=>{
                                if(String(el.employee) == String(employment._id)){
                                        return el;
                                }
                        });
                        //check that id does not exist already in user
                        let user = await User.findOne({profile: profileId}).exec();
                        let resultUser = user.employment.find(el=>{
                                if(String(el._id) == String(employment._id)){
                                        return el;
                                }
                        });
                        
                        //add employee to company employee list - as applicant
                        //only add if it doesnt exist already
                        if(!resultCompany){
                                task.update('companies', {_id: company._id}, {$push:{ employees: {$each: [{employee: employment._id}], $position: 0, $slice: 50}}});
                        }
                        //add employee to user account 
                        //only add if it doesnt exist already
                        if(!resultUser){
                                task.update('users', {profile: user.profile}, {$push:{ employment: {$each: [{_id: employment._id}], $position: 0, $slice: 50}}});
                        }


                }

                task.run().then((result)=>{

                        return res.status(200).send(result);
                }, (error)=>{
                        
                        return res.status(200).send(error);
                });
        }
});

//profile - resign company TODO
router.route('/me/resign').post(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

        const profileId = req.user.profile;
        const companyId = req.query.companyId;

        //check that company id is passed
        if(!companyId){return res.status(400).send({message:'Bad request.'});}
        //check that profile exist
        const company = await Company.findById(companyId).exec();
        if(!company){return res.status(404).send({message:'Could not locate company to hire.'})}

        //check if employment is already available
        let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
        if(!employment){return res.status(404).send({message:'Could not locate employee'});}

        
        //check status
        if(employment.status == 'hired'){

                const now = moment().toDate();
                const reqBody = req.body;
                
                //validate data
                let {error} = Employee.validateDismiss(reqBody);
                if(error){return res.status(400).send({message: 'Bad request'})}

                const dateEffect = moment(new Date(reqBody.dateEffective)).toDate();
                
                let data = {
                        assignment:{
                                _id: tools.get.objectId(),
                                position: "resigned",
                                dateAnnounced: now,
                                dateEffective: dateEffect,
                                remarks: reqBody.remarks,
                                location: ""
                        },
                        salary:{
                                _id: tools.get.objectId(),
                                amount: 0,
                                rate: 'day',
                                dateAnnounced: now,
                                dateEffective: dateEffect,
                                remarks: reqBody.remarks
                        },
                        separation:{
                                _id: tools.get.objectId(),
                                dateSubmitted: now,
                                dateEffective: dateEffect,
                                class: 'resigned',
                                reason: reqBody.reason,
                                remarks: reqBody.remarks
                        },
                        info: {
                                _id: tools.get.objectId(), 
                                class: "resigned", 
                                date: now
                        }
                };

                //run task
                let task = Fawn.Task();

                //insert Separation
                task.update('employees', {_id: employment._id}, {$push: {separation: {$each: [data.separation], $position: 0}}});
                
                // insert assignment
                task.update('employees', {_id: employment._id}, {$push: {assignment: {$each: [data.assignment], $position: 0}}});
                
                //insert salary
                task.update('employees', {_id: employment._id}, {$push: {salary: {$each: [data.salary], $position: 0}}});

                //change status to resigned
                task.update('employees', {_id: employment._id}, {$set: {status: 'resigned'}});

                //insert into infodate the resigned info
                task.update('employees', {_id: employment._id}, {$push: {infoDate: {$each: [data.info], $position: 0}}});
                
                //check that company exist & remove employee from company
                const company = await Company.findById(companyId).exec();
                if(!company){return res.status(404).send({message: ' could not locate company'});}
                task.update('companies', {_id: company._id}, {$pull: {employees: {employee: employment._id}}});
                
                //check user exist & remove employment from user
                const user = await User.findById(req.user._id).exec();
                if(!user){return res.status(404).send({message: ' could not locate user'});}
                task.update('users', {_id: user._id}, {$pull: {employment: {_id: employment._id}}});

                task.run()
                .then((result)=>{
                        return res.status(200).send({message:result});
                }, (error)=>{
                        return res.status(200).send({message: 'Error.', error: error});
                });

        }else{
                return res.status(400).send({message: 'Profile no longer within company.'});
        }
});

//profile - get all companies that you are under or have been under in employment? TODO
router.route('/me/employers').get(auth.isAuth, auth.isAccountType('profile'), async(req,res,next)=>{

        //check user exist
        let user = await User.findById(req.user._id)
        .populate('employment._id')
        .populate({ path: 'employment._id', 
                populate:{path:'profile'}})
        .populate({ path: 'employment._id', 
                populate:{path:'company'}})
        .exec();

        if(!user){return res.status(404).send({message: "could not locate profile information"});}
    
        if(!req.query.id){

                //TODO: have filter or sort
                return res.status(200).send(user.employment);
        }else{
                let id = req.query.id;
                //validate oject id
                if(!validate.isObjectId(id)){ return res.status(400).send(error);}

                //find the employment record
                let result = user.employment.find(element=>{
                        if(element._id.id == id || element._id == id){
                                return element;
                        }
                });
    
                //return results
                if(!result){ 
                    return res.status(404).send({message: 'Invalid ID, or employer no longer exist'});
                }else{
                    res.status(200).send(result);
                }
        }

});


//company ---------------------------------------------------Company

//company - scout profiles - all or by query.profileId
router.route('/scout/profile').get(auth.isAuth, auth.isAccountType('company'), async(req,res,next)=>{

        //check a profile exist
        let profiles = await Profile.find().exec();
        if(!profiles){return res.status(404).send({message:'Could not locate any companies'});}

        //check if query parameter is passed for company id
        if(!req.query.profileId){

                //TODO: filter search
                //return all profiles
                res.status(200).send(profiles);
        }else{
                const profileId = req.query.profileId;
                //check id passed is valid object id
                if(!validate.isObjectId(profileId)){ return res.status(400).send({message:"Bad request invalid id."});}

                let profile = await Profile.findById(profileId).exec();
                if(profile){
                        return res.status(200).send(profile);
                }else{
                        return res.status(404).send({message: "could not locate id."})
                }

        }

});

//company see employees recruited or employeed under you all or by id
//get all employees under the company or 1 by id
router.route('/me/employees').get(auth.isAuth, auth.isAccountType('company'), async (req, res, next)=>{

        //check company exist
        let company = await Company.findById(req.user.company)
        .populate('employees.employee')
        .populate({ path: 'employees.employee', 
                populate:{path:'profile'}})
        .exec();

        if(!company){return res.status(404).send({message: "could not locate company information"});}
    
        if(!req.query.id){
                //TODO: return only employees with status applied
                return res.status(200).send(company.employees);
        }else{
                let id = req.query.id;
                //validate oject id
                if(!validate.isObjectId(id)){ return res.status(400).send(error);}

                //find the employee wihtin company
                let result = company.employees.find(element=>{
                        if(element.employee == id){
                                return element;
                        }
                });
    
                //return results
                if(!result){ 
                    return res.status(404).send({message: 'Invalid ID, or employee no longer exist'});
                }else{
                    res.status(200).send(result);
                }
        }
    
});


//TODO: middleware role based authentication
//TODO: validation middle ware
//recruit employee
router.route('/me/recruit').post(auth.isAuth, auth.isAccountType('company'), async (req,res,next)=>{
        
    //check profile id was passed
    if(!req.query.profileId){return res.status(400).send({message: "Bad request"})}

    const companyId = req.user.company;
    const profileId = req.query.profileId
    let employee = {status: "recruited"};//should this be in the request body?

    //check if company exist
    let company = await Company.findById(companyId).exec();
    if(!company){return res.status(404).send({message: "Could not locate company"})}
    //check that profile exist
    let profile = await Profile.findById(profileId).exec();
    if(!profile){return res.status(404).send({message: "Could not locate profile"})}

    let employeeExist = await Employee.findOne({company: companyId, profile: profileId}).exec();

    const task = Fawn.Task();
    //create applied date now
    let now = new Date(Date.now());
    let appliedInfo = {_id: tools.get.objectId(), class: "recruited", date: now}

    //use current instead
    if(employeeExist){
            if(employeeExist.status == 'applied' || employeeExist.status == 'hired' || employeeExist.status == 'recruited' || employeeExist.status == 'accepted'){
                return res.status(200).send({message: `employee status is already ${employeeExist.status}.`});
            }else{

                employeeExist.infoDate.unshift(appliedInfo);
                employeeExist.status = 'recruited';
                
                task.update('employees', {_id: employeeExist._id}, {$set: employeeExist});
                employee = employeeExist._id;
        }
    }else{
        //create employee
        //assign employee company id & profile id
        employee.company = companyId;
        employee.profile = profileId;

        
        //save application info
        employee.infoDate = [];
        employee.infoDate.unshift(appliedInfo);
        
        //validate input
        let {error} = Employee.validate(employee);
        if(error){return res.status(400).send({message: 'Bad request.', error: error});}

        let newEmployee = new Employee(employee);

        //save employee
        //TODO: set employee number limit in model
        task.save('employees', newEmployee);
        employee = newEmployee._id;
    }
    
    //check that id does not exist already in company
    let resultCompany = company.employees.find(el=>{
       if(String(el.employee) == String(employee.employee)){
               return el;
       }
    });
    //check that id does not exist already in profile
    let user = await User.findOne({profile: profile._id}).exec();
    if(!user){return res.status(404).send({message: ' could not locate user'});}
        let resultUser = user.employment.find(el=>{
                if(String(el._id) == String(employee.employee)){
                        return el;
                }
        });
    
    //add employee to company employee list - as applicant
    //only add if it doesnt exist already
    if(!resultCompany){
            task.update('companies', {_id: company._id}, {$push:{ employees: {$each: [{employee: employee}], $position: 0, $slice: 50}}});
    }
    //add employee to user account 
    //only add if it doesnt exist already
    if(!resultUser){
            task.update('users', {company: company._id}, {$push:{ employment: {$each: [{_id: employee}], $position: 0, $slice: 50}}});
    }
    //run tasks
        task.run()
        .then((result)=>{
                res.status(200).send({message: "Success", result: result});
        }, (error)=>{
                res.status(500).send({message: "Failed", error: error});
        });


//company - cancel recruitment TODO
}).put(auth.isAuth, auth.isAccountType('company'), async(req,res,next)=>{


        if(!req.query.profileId){return res.status(400).send({message: "No query id passed"})}

        const companyId = req.user.company;
        const profileId = req.query.profileId;

        //check that employment exist
        let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
        if(!employment){ return res.status(404).send({message: "Could not locate employment.", result: employment, company: companyId, profile: profileId});}

        
        if(employment.status == 'recruited' || employment.status == 'accepted'){

                //run task
                let task = Fawn.Task();

                //change status into cancelled
                task.update('employees', {_id: employment._id}, {$set: {status: 'cancelled'}});

                //create applied date now
                let now = new Date(Date.now());
                let info = {_id: tools.get.objectId(), class: "cancelled", date: now}

                //push infoDate status - cancelled
                task.update('employees', {_id: employment._id}, {$push: {infoDate: {$each:[info], $position:0}}});

                //check user exist
                let user = await User.findById(req.user._id).exec();
                //run as task - pull from employment under user
                task.update('users', {_id: user._id}, {$pull: {employment: {_id: employment._id}}});

                //check company exist
                const company = await Company.findById(companyId).exec();
                //run as task - pull from employment under company
                task.update('companies', {_id: company._id}, {$pull: {employees: {employee: employment._id}}});

                task.run().then((result)=>{

                        return res.status(200).send(result);
                }, (error)=>{
                        
                        return res.status(200).send(error);
                });

        //check employement status
        }else if(employment.status == 'hired'){

                return res.status(400).send({message:`Status already ${employment.status}.`});
        //else - you are not applied within the company
        }else{
                return res.status(400).send({message:'You are not applied within the company'});
        }

});



//company - hire TODO - salary upon hiring and location assigned
router.route('/me/hire').post(auth.isAuth, auth.isAccountType('company'), async (req,res,next)=>{

        const profileId = req.query.profileId;
        const companyId = req.user.company;

        //check that profile id is passed
        if(!profileId){return res.status(400).send({message:'Bad request.'});}

        //check that profile exist
        const profile = await Profile.findById(profileId).exec();
        if(!profile){return res.status(404).send({message:'Could not locate profile to hire.'})}

        //check if employment is already available
        let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
        if(!employment){return res.status(404).send({message:'Could not locate employee'});}

        
        //check status
        if(employment.status == 'applied' || employment.status == 'accepted'){
                const now = moment().toDate();
                let data = req.body;
                data.salary.dateAnnounced = now;
                data.assignment.dateAnnounced = now;
                //create the infodate the hired info
                const info = {_id: tools.get.objectId(), class: "hired", date: now}
                
                //validate req.body
                let {error} = Employee.validateHire(data);

                //add Id for beter search and retrieve later
                data.salary._id = tools.get.objectId();
                data.assignment._id = tools.get.objectId();
                //turn string into object id
                data.assignment.location = tools.get.objectId(data.assignment.location);

                //run task
                let task = Fawn.Task();

                // //insert assignment
                task.update('employees', {_id: employment._id}, {$push: {assignment: {$each: [data.assignment], $position: 0}}});
                
                //insert salary
                task.update('employees', {_id: employment._id}, {$push: {salary: {$each: [data.salary], $position: 0}}});

                //insert infoDate
                task.update('employees', {_id: employment._id}, {$push: {infoDate: {$each: [info], $position: 0}}});
                
                //change status to hired
                task.update('employees', {_id: employment._id}, {$set: {status: 'hired'}});
                
                //check that company exist
                const company = await Company.findById(companyId).exec();
                if(!company){return res.status(404).send({message: ' could not locate company'});}
                //check that id does not exist already in company
                let resultCompany = company.employees.find(el=>{
                        if(String(el.employee) == String(employment._id)){
                                return el;
                        }
                });
                //insert profile into company employees
                if(!resultCompany){
                        task.update('companies', {_id: company._id}, {$push: {employees: {employee: employment._id}}});
                }
                
                //check user exist
                const user = await User.findById(req.user._id).exec();
                if(!user){return res.status(404).send({message: ' could not locate user'});}
                //check that id does not exist already in user
                let resultUser = user.employment.find(el=>{
                        if(String(el._id) == String(employment._id)){
                                return el;
                        }
                });
                //insert employment into user employment
                if(!resultUser){
                        task.update('users', {_id: user._id}, {$push: {employment: {_id: employment._id}}});
                }

                task.run()
                .then((result)=>{
                        return res.status(200).send({message:result});
                }, (error)=>{
                        return res.status(200).send({message: 'Error.', error: error});
                });

        }else if(employment.status == 'recruited'){
                return res.status(400).send({message: 'Profile must accept your invitation first.'});
        }else if(employment.status == 'hired'){
                return res.status(400).send({message:'Status already hired'})
        }else{
                return res.status(400).send({message: 'Profile must have a status of applied or accepted before hiring.'});
        }
        
});

//company - dismiss TODO
router.route('/me/dismiss').post(auth.isAuth, auth.isAccountType('company'), async (req,res,next)=>{

        const profileId = req.query.profileId;
        const companyId = req.user.company;

        //check that profile id is passed
        if(!profileId){return res.status(400).send({message:'Bad request.'});}
        //check that profile exist
        const profile = await Profile.findById(profileId).exec();
        if(!profile){return res.status(404).send({message:'Could not locate profile to hire.'})}

        //check if employment is already available
        let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
        if(!employment){return res.status(404).send({message:'Could not locate employee'});}

        
        //check status
        if(employment.status == 'hired'){

                const now = moment().toDate();
                const reqBody = req.body;
                
                //validate data
                let {error} = Employee.validateDismiss(reqBody);
                if(error){return res.status(400).send({message: 'Bad request'})}

                const dateEffect = moment(new Date(reqBody.dateEffective)).toDate();
                
                let data = {
                        assignment:{
                                _id: tools.get.objectId(),
                                position: "dismissed",
                                dateAnnounced: now,
                                dateEffective: dateEffect,
                                remarks: reqBody.remarks,
                                location: ""
                        },
                        salary:{
                                _id: tools.get.objectId(),
                                amount: 0,
                                rate: 'day',
                                dateAnnounced: now,
                                dateEffective: dateEffect,
                                remarks: reqBody.remarks
                        },
                        separation:{
                                _id: tools.get.objectId(),
                                dateSubmitted: now,
                                dateEffective: dateEffect,
                                class: 'dismissed',
                                reason: reqBody.reason,
                                remarks: reqBody.remarks
                        }
                };

                //run task
                let task = Fawn.Task();

                //insert Separation
                task.update('employees', {_id: employment._id}, {$push: {separation: {$each: [data.separation], $position: 0}}});
                
                // insert assignment
                task.update('employees', {_id: employment._id}, {$push: {assignment: {$each: [data.assignment], $position: 0}}});
                
                //insert salary
                task.update('employees', {_id: employment._id}, {$push: {salary: {$each: [data.salary], $position: 0}}});

                //change status to dimissed
                task.update('employees', {_id: employment._id}, {$set: {status: 'dimissed'}});

                //insert into infodate the dimissed info
                const info = {_id: tools.get.objectId(), class: "dimissed", date: now}
                task.update('employees', {_id: employment._id}, {$push: {infoDate: {$each: [info], $position: 0}}});
                
                //check that company exist & remove employee from company
                const company = await Company.findById(companyId).exec();
                if(!company){return res.status(404).send({message: ' could not locate company'});}
                task.update('companies', {_id: company._id}, {$pull: {employees: {employee: employment._id}}});
                
                //check user exist & remove employment from user
                const user = await User.findById(req.user._id).exec();
                if(!user){return res.status(404).send({message: ' could not locate user'});}
                task.update('users', {_id: user._id}, {$pull: {employment: {_id: employment._id}}});

                task.run()
                .then((result)=>{
                        return res.status(200).send({message:result});
                }, (error)=>{
                        return res.status(200).send({message: 'Error.', error: error});
                });

        }else{
                return res.status(400).send({message: 'Profile no longer within company.'});
        }

});

//TODO: on date effective - change status to dismiss or hire - how would i handle this?

//TODO: infoDate - new
//TODO: info date - edit
//TODO: info date - delete

//TODO: insert new assignment
//TODO: update - assignment
//TODO: delete assignment

//TODO: insert new salary
//TODO: update - salary
//TODO: delete salary


//TODO: crud employees - when already employed - this is when role based authentication comes in to play

module.exports = router;



//Still contemplating if profile user should have the ability to delete their employment data - maybe admin staff should be able to do this??
// //profile - delete employment
// router.route('/me').delete(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

//         if(!req.query.companyId){return res.status(400).send({message: "No query id passed"})}

//         const companyId = req.query.companyId;
//         const profileId = req.user.profile;

//         //check that employment exist
//         let employment = await Employee.findOne({profile: profileId, company: companyId}).exec();
//         if(!employment){ return res.status(404).send({message: "Could not locate employment.", result: employment, company: companyId, profile: profileId});}

//         //run task
//         let task = Fawn.Task();

//         //check user exist
//         const user = await User.findById(req.user._id).exec();
//         //run as task - pull from employment under user
//         task.update('users', {_id:user._id}, {$pull: {employment: {_id: employment._id}}});

//         //check company exist
//         const company = await Company.findById(companyId).exec();
//         //run as task - pull from employment under company
//         task.update('companies', {_id: company._id}, {$pull: {employees: {employee: employment._id}}});

//         //remove employment data
//         task.remove('employees', {_id: employment._id});

//         task.run().then((result)=>{

//                 return res.status(200).send(result);
//         }, (error)=>{
                
//                 return res.status(200).send(error);
//         });
// });