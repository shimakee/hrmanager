const   mongoose    = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        Schema      = mongoose.Schema,
        ObjId       = Schema.Types.ObjectId,
        regex       = require('../customLib/index').regex;

var company = new Schema({
    // username: {type: String, required: [true, "Username required"], unique: true, dropDups: true
    //         , match: [regex.username, 'Invalid input on username']},
    // password: {type: String, required: [true, "Password required"]
    //         , match: [regex.password, 'Invalid input on password']},
    active: {type: Boolean, default: false},
    tradename: {type: String, required: [true, 'Tradename required'], 
    // unique: true, dropDups: true,
            },
    ownershipType: {type: String, enum: ['sole proprietor', 'partnership', 'corporation']},
    owner: [{type: ObjId, ref: 'Identity'}],
    business: [{type: ObjId, ref: 'Business'}],
    profilePicDir: {type: String},
    picDir: {type: String},
    profilePicName: {type: String,},
    contact:    [{main: {type: Boolean, default: false}, //TODO ObjId reference to new contact schema
        description: {type: String}, 
        countryCode: {type: Number,min:0, max:999999}, 
        areaCode: {type: Number, min:0, max:999999}, 
        number: {type: Number, min:0, max:999999999999999}}],
    email:      [{main: {type: Boolean, default: false},
            address: {type: String}}],
    address:    [{main: {type: Boolean, default: false},
            description: {type: String},
            street: {type: String},
            city:{type:String},
            country:{type:String},
            province: {type:String},
            zipcode: {type: Number, min: 1000, max: 9999},
            position:{
                lat:{type: Number},
                lng: {type:Number}
            }}],
    government: [{key: {type: String},  
            info: {type: String}}],
    appicants: [{type: ObjId, ref: 'Profile'}],
    employees: [{type: ObjId, ref: 'Employment'}]
});

// company.plugin(passportLocalMongoose,{
//     limitAttempts: true,
//     maxAttemps: 3,
//     interval: 120000,
//     hashField: 'password'
// });

module.exports = mongoose.model('Company', company);