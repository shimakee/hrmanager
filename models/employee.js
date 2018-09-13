const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjId = mongoose.Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');//validator
        Joi.objectId = require('joi-objectid')(Joi);

//set variables
const infoDateLimit = 100;
const separationLimit = 100;
const assignmentLimit = 1000;
const salaryLengthLimit = 1000;

const employee = new Schema({
    active: {type: Boolean, default: false},
    profile: {type: ObjId, ref: 'Profile'},
    company: {type: ObjId, ref: 'Company'},
    status: {type: String, enum:['applied','rejected', 'wait-listed','hired', 'resigned', 'dismissed']}, //TODO change to enum hired/resigned/dismissed/applied
    infoDate:[{
        class: {type:String, enum:['applied', 'rejected', 'hired']},
        date: {type: Date},
        remarks: {type: String}
    }],
    separation:[{
        dateSubmitted: {type: Date},
        dateRecieved: {type: Date},
        dateEffective: {type: Date},
        class:{type:String, enum:['dismiss', 'resign']},
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
        remark: {type: String}
    }],
    salary:[{
        amount: {type:Number},
        rate:{type: String, enum:['hour', 'day', 'week', 'month', 'quarter', 'semi-annual', 'year']}, //TODO enum (hourly/daily/weekly/monthly/yearly)
        dateAnnounced: {type: Date},
        dateEffective: {type: Date},
        remark: {type: String}
    }]
});

//variables available
employee.statics.lengthLimit = {
    infoDate: infoDateLimit,
    separation: separationLimit, 
    assignment: assignmentLimit,
    salary: salaryLengthLimit
}

//methods
employee.statics.validate = function(data){
    return validate(data);
}
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
        class: Joi.string().regex(regex.address).required(),
        date: Joi.date().min('1-1-1900').max('now').required(),
        remarks: Joi.string().regex(regex.address).allow('')
    });

    const employeeSchema = Joi.object().keys({
        active: Joi.boolean().allow(''),
        profile: Joi.objectId().required(),
        company: Joi.objectId().required(),
        status: Joi.string().valid(validDataLib.employeeStatus).required(),
        infoDate: Joi.array().max(5).items(infoSchema.required()).single().required()

    });

    return employeeSchema.validate(data);
}

function findElement(array, key, value){
    const result = array.find(el=>{
            if(el[key] == value){
                return el;
        }
    });

    return result;
}