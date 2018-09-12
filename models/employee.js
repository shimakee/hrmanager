const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjId = mongoose.Schema.Types.ObjectId;

const employment = new Schema({
    active: {type: Boolean, default: false},
    employee: {type: ObjId, ref: 'Identity'},
    employer: {type: ObjId, ref: 'Company'},
    status: {type: String, enum:['applied','rejected', 'wait-listed','hired', 'resigned', 'dismissed']}, //TODO change to enum hired/resigned/dismissed/applied
    application:[{
        date: {type: Date},
        evaluation: {type: String}
    }],
    interview:[{
        date: {type: Date},
        evaluation: {type: String}
    }],
    hire:[{
        date: {type: Date},
        evaluation: {type: String}
    }],
    separation:[{
        dateSubmitted: {type: Date},
        dateRecieved: {type: Date},
        dateEffective: {type: Date},
        class:{type:String, enum:['dismiss', 'resign']},
        reason: {type: String}
    }],
    payroll:[{type: ObjId, ref: 'Payroll'}],
    attendance: [{type: ObjId, ref: 'Attendance'}],
    memo:[{type: ObjId, ref: 'Memo'}],
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

module.exports = mongoose.model('Employment', employment);