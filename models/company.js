const   mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        ObjId       = Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');//validator
        Joi.objectId = require('joi-objectid')(Joi);

        //TODO: create method to get main email

var company = new Schema({
    // username: {type: String, required: [true, "Username required"], unique: true, dropDups: true
    //         , match: [regex.username, 'Invalid input on username']},
    // password: {type: String, required: [true, "Password required"]
    //         , match: [regex.password, 'Invalid input on password']},
    authenticated: {type: Boolean, default: false},
    tradename: {type: String, required: [true, 'Tradename required'], 
    // unique: true, dropDups: true,
            },
    ownershipType: {type: String, enum: ['sole proprietor', 'partnership', 'corporation']},
    owner: [{profile: {type: ObjId, ref: 'Profile'}}],
//     business: [{type: ObjId, ref: 'Business'}],
    picDir: {type: String}, //by default is already set at config - no need to save it yet
    pics:[{filename: {type: String},
        path: {type: String},
        encoding: {type: String},
        mimetype: {type: String},
        size: {type: Number}}],
    companyPicName: {type: String,}, //set which pic as profile
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
    appicants: [{profile: {type: ObjId, ref: 'Profile'}}]
//     ,
//     employees: [{profile: {type: ObjId, ref: 'Employment'}}]
});

// company.plugin(passportLocalMongoose,{
//     limitAttempts: true,
//     maxAttemps: 3,
//     interval: 120000,
//     hashField: 'password'
// });

company.statics.validateRegistration = function(data){
        return validateRegistration(data);
}

module.exports = mongoose.model('Company', company);

function validateRegistration(data){
        const ownerSchema = Joi.object().keys({
                profile: Joi.objectId().required()
        });

        const emailSchema = Joi.object().keys({//to be tested
                main:Joi.boolean().allow(''),
                address:Joi.string().email().required()
            });

        const companySchema = Joi.object().keys({
                tradename: Joi.string().regex(regex.commonAlphaNum).min(1).max(255).required(),
                ownershipType: Joi.string().valid(validDataLib.ownershipType).required(),
                owner: Joi.array().max(30).unique('profile').items(ownerSchema).single(),
                email:Joi.array().max(5).unique('address').items(emailSchema.required()).single().required(),     
        });

        return companySchema.validate(data);
}