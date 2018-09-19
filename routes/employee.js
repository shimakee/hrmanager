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



//profile - scout company all or by query.companyId
router.route('/scout/company').get(auth.isAuth, auth.isAccountType('profile'), async(req,res,next)=>{

        //check a company exist
        let companies = await Company.find().exec();
        if(!companies){return res.status(404).send({message:'Could not locate any companies'});}

        //check if query parameter is passed for company id
        if(!req.query.companyId){

                //TODO: filter search
                //return all companies
                console.log(companies);
                res.status(200).send(companies);
        }else{
                const companyId = req.query.companyId;
                //check id passed is valid object id
                if(!validate.isObjectId(companyId)){ return res.status(400).send({message:"Bad request invalid id."});}

                let company = await Company.findById(companyId).exec();
                if(company){
                        return res.status(200).send(company);
                }else{
                        return res.status(404).send({message: "could not locate id."})
                }

        }


});

//profile - apply company - change url or read body for status of application?
router.route('/me/apply').post(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

        const profileId = req.user.profile; 
        const companyId= req.query.companyId;

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
                let appliedInfo = {class: "applied", date: now}

                //start a task
                let task = Fawn.Task();

                if(employee){
                        //check status if hired or applied
                        if(employee.status == "applied" || employee.status == "hired"){
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
                        if(error){return res.status(400).send({message: 'Bad request.', error: error});}

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
        if(employment.status == 'applied'){

                //run task
                let task = Fawn.Task();

                //change status into cancelled
                task.update('employees', {_id: employment._id}, {$set: {status: 'cancelled'}});

                //create applied date now
                let now = new Date(Date.now());
                let info = {class: "cancelled", date: now}

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

//profile - delete employment
router.route('/me').delete(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

});

//accept recruitment by company
router.route('/me/recruit/accept').post(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

});

//profile - resign company TODO
router.route('/me/resign').post(auth.isAuth, auth.isAccountType('profile'), async (req,res,next)=>{

});

//profile - get all companies that you are under or have been under in employment? TODO
router.route('/me/employers').get(auth.isAuth, auth.isAccountType('profile'), async(req,res,next)=>{

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
    let appliedInfo = {class: "recruited", date: now}

    //use current instead
    if(employeeExist){
            if(employeeExist.status == 'applied' || employeeExist.status == 'hired' || employeeExist.status == 'recruited'){
                return res.status(200).send({message: `employee is already ${employeeExist.status} under your company.`});
            }else{

                employeeExist.infoDate.unshift(appliedInfo);
                employeeExist.status = 'recruited';
                
                task.update('employees', {_id: employeeExist._id}, {$set: employeeExist});
                employee = {employee: employeeExist._id};
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
        employee = {employee: newEmployee._id};
    }
    
    //check that id does not exist already in company
    let resultCompany = company.employees.find(el=>{
       if(String(el.employee) == String(employee.employee)){
               return el;
       }
    });
    //check that id does not exist already in profile
    let user = await User.findOne({profile: profile._id}).exec();
        let resultUser = user.employment.find(el=>{
                if(String(el._id) == String(employee.employee)){
                        return el;
                }
        });
    
    //add employee to company employee list - as applicant
    //only add if it doesnt exist already
    if(!resultCompany){
            task.update('companies', {_id: company._id}, {$push:{ employees: {$each: [employee], $position: 0, $slice: 50}}});
    }
    //add employee to user account 
    //only add if it doesnt exist already
    if(!resultUser){
            task.update('users', {profile: profile._id}, {$push:{ employment: {$each: [{_id: employee.employee}], $position: 0, $slice: 50}}});
    }
    //run tasks
        task.run()
        .then((result)=>{
                res.status(200).send({message: "Success", result: result});
        }, (error)=>{
                res.status(500).send({message: "Failed", error: error});
        });


//company - cancel recruitment
}).put(auth.isAuth, auth.isAccountType('company'), async(req,res,next)=>{

});



//company - hire TODO
router.route('/me/hire').post(auth.isAuth, auth.isAccountType('company'), async (req,res,next)=>{
        

//company cancel recruitment
}).delete(auth.isAuth, auth.isAccountType('company'), async (req,res,next)=>{

});

//company - dismiss TODO
router.route('/me/dismiss').post(auth.isAuth, auth.isAccountType('company'), async (req,res,next)=>{

});


//TODO: crud employees - when already employed - this is when role based authentication comes in to play

module.exports = router;