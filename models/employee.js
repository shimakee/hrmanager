const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjId = mongoose.Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');//validator
        Joi.objectId = require('joi-objectid')(Joi);
const   moment = require('moment');

//set variables
const infoDateLimit = 100;
const separationLimit = 100;
const assignmentLimit = 1000;
const salaryLengthLimit = 1000;

const employee = new Schema({
    active: {type: Boolean, default: false},
    profile: {type: ObjId, ref: 'Profile'},
    company: {type: ObjId, ref: 'Company'},
    status: {type: String, enum:validDataLib.employeeStatus},
    infoDate:[{
        class: {type:String, enum:validDataLib.employeeStatus},
        date: {type: Date},
        remarks: {type: String}
    }],
    separation:[{
        dateSubmitted: {type: Date},
        dateRecieved: {type: Date},
        dateEffective: {type: Date},
        class:{type:String, enum:validDataLib.employeeSeparationClass},
        reason: {type: String},
        remarks:{type: String}
    }],
    // payroll:[{payroll: {type: ObjId, ref: 'Payroll'}}], //future feature
    // attendance: [{attedance: {type: ObjId, ref: 'Attendance'}}], //future feature
    // memo:[{info:{type: ObjId, ref: 'Memo'}}], //future feature
    assignment:[{
        position: {type: String},
        location: {type: ObjId, ref: 'Business'},
        dateAnnounced: {type: Date},
        dateEffective: {type: Date},
        remarks: {type: String}
    }],
    salary:[{
        amount: {type:Number}, //amount should be in cents must always be an integer not a floating point
        rate:{type: String, enum:validDataLib.salaryRate},
        dateAnnounced: {type: Date},
        dateEffective: {type: Date},
        remarks: {type: String}
    }]
});

//variables available
employee.statics.lengthLimit = {
    infoDate: infoDateLimit,
    separation: separationLimit, 
    assignment: assignmentLimit,
    salary: salaryLengthLimit
}

//statics
employee.statics.validate = function(data){
    return validate(data);
}

employee.statics.isValidStatus = function(data){

    return Joi.validate(data, Joi.string().valid(validDataLib.employeeStatus).required());
}

employee.statics.validateHire = function(data){
    return validateHire(data);
}

employee.statics.validateDismiss = function (data){
    return validateDismiss(data);
}

//methods
//find assignment
employee.methods.findAssignment = function (key, value){
    let result = this.assignment.find(el=>{
            if(el[key] == value){
                return el;
        }
    });

    return result;
}

//find separation
employee.methods.findSeparation = function (key, value){
    let result = this.separation.find(el=>{
            if(el[key] == value){
                return el;
        }
    });

    return result;
}

//find infoDate
employee.methods.findinfoDate = function (key, value){
    let result = this.infoDate.find(el=>{
            if(el[key] == value){
                return el;
        }
    });

    return result;
}


//to check - if it works
//find salary
employee.methods.findSalary = function (key, value){
    let result = findElement(this.salary, key, value);
    return result;
}

module.exports = mongoose.model('Employee', employee);

function validate(data){
    const infoSchema = Joi.object().keys({
        _id: Joi.objectId().required(),
        class: Joi.string().max(1020).regex(regex.address).required(),
        date: Joi.date().min('1-1-1900').max('now').required(),
        remarks: Joi.string().max(510).regex(regex.address).allow('')
    });

    const employeeSchema = Joi.object().keys({
        active: Joi.boolean().allow(''),
        profile: Joi.objectId().required(),
        company: Joi.objectId().required(),
        status: Joi.string().max(510).valid(validDataLib.employeeStatus).required(),
        infoDate: Joi.array().max(5).items(infoSchema.required()).single().required()

    });

    return employeeSchema.validate(data);
}

function validateHire(data){
    const now = moment().subtract(1, 'h').toDate();
    const nYearsFromNow = moment().add(100, 'y').toDate();

    const assignmentSchema =  Joi.object().keys({
        // _id: Joi.objectId().required(),
        position: Joi.string().min(1).max(150).regex(regex.commonAlphaNum).required(),
        location: Joi.objectId().allow(""),
        dateAnnounced: Joi.date().min(now).max(nYearsFromNow).required(),
        dateEffective: Joi.date().min(now).max(nYearsFromNow).required(),
        remark: Joi.string().max(510).regex(regex.commonAlphaNum).allow("")
    });
    const salarySchema = Joi.object().keys({
        // _id: Joi.objectId().required(),
        amount: Joi.number().greater(0).precision(0).required(), //amount should be in cents
        rate:Joi.string().valid(validDataLib.salaryRate).required(),
        dateAnnounced: Joi.date().min(now).max(nYearsFromNow).required(),
        dateEffective: Joi.date().min(now).max(nYearsFromNow).required(),
        remarks: Joi.string().max(510).regex(regex.commonAlphaNum).allow("")
    });

    const hireSchema = Joi.object().keys({
        assignment: Joi.array().items(assignmentSchema.required()).single().required(),
        salary: Joi.array().items(salarySchema.required()).single().required()
    });

    return hireSchema.validate(data);
}

function validateDismiss(data){
    
    const now = moment().subtract(1, 'h').toDate();
    const nYearsFromNow = moment().add(100, 'y').toDate();

    const dismissSchema = Joi.object().keys({
        dateEffective: Joi.date().min(now).max(nYearsFromNow).required(),
        reason: Joi.string().max(510).regex(regex.commonAlphaNum).required(),
        remarks: Joi.string().max(510).regex(regex.commonAlphaNum).allow("")
    });

    return dismissSchema.validate(data);
}

function findElement(array, key, value){ //move to tools
    const result = array.find(el=>{
            if(el[key] == value){
                return el;
        }
    });

    return result;
}