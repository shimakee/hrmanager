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

router.route('/me/recruit').get(auth.isAuth, async (req, res, next)=>{
    //check company exist
    let company = await Company.findById(req.user.company)
        .populate('employees.employee')
        .populate({ path: 'employees.employee', 
                populate:{path:'profile'}}).exec();
    if(!company){return res.status(404).send({message: "could not locate company information"});}

            let id = company._id;
            //validate oject id
            if(!validate.isObjectId(id)){return res.status(400).send(error);}
            //find the employee
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

    //recruit employees TODO:
    //TODO: only account type company are allowed to recruit - middleware account type authentication
    //TODO: middleware role based authentication
}).post(auth.isAuth, async (req,res,next)=>{
        
        const companyId = req.user.company;
    let employee = {status: "applied"};
        //check profile id was passed
    if(!req.query.profileId){return res.status(400).send({message: "Bad request"})}
    const profileId = req.query.profileId

    //OPTIONAL: before adding check employee length and deny add instead of slicing and auto deleting last entry
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
    let appliedInfo = {class: "applied", date: now}

    //use current instead
    if(employeeExist){
            employeeExist
            employeeExist.infoDate.push(appliedInfo);
            employeeExist.status = 'applied';

            //have validation?

        task.update('employees', {_id: employeeExist._id}, {$set: employeeExist});
        employee = {employee: employeeExist._id};
    }else{
        //create employee
        //assign employee company id & profile id
        employee.company = companyId;
        employee.profile = profileId;

        
        //save application info
        employee.infoDate = [];
        employee.infoDate.push(appliedInfo);
        
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

        //TODO: check for duplicated in employee - and in array if object id alreayd exist

//edit business 1 by 1
});

//TODO: crud employees
//recruit

module.exports = router;