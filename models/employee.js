const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjId = mongoose.Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');//validator
        Joi.objectId = require('joi-objectid')(Joi);

const employee = new Schema({
    active: {type: Boolean, default: false},
    profile: {type: ObjId, ref: 'Profile'},
    employer: {type: ObjId, ref: 'Company'},
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
    assingment:[{
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

module.exports = mongoose.model('Employee', employee);