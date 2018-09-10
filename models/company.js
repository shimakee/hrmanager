const   mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        ObjId       = Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');//validator
        Joi.objectId = require('joi-objectid')(Joi);

        //TODO: create method to get main email
        //TODO: create methods to call for updates and deletes to use througout the routes -same for other models
        //TODO: create class for multiple used schemas - like owner

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
    owner: [{profile: {type: ObjId, ref: 'Profile'},
        position: {type: String}}],
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
company.statics.validateUpdate = function(data){
        return validateUpdate(data);
}
company.statics.validateId = function(data){
        return validateId(data);
}
company.statics.validateOwner = function(data){
        return validateOwner(data);
}
company.statics.validateOwnerUpdate = function(data){
        return validateOwnerUpdate(data);
}

module.exports = mongoose.model('Company', company);

//TODO: general validation of company
function validate(data){
        const ownerSchema = Joi.object().keys({
                profile: Joi.objectId().required(),
                position: Joi.string().max(255).regex(regex.commonAlphaNum).required()
        });

        const emailSchema = Joi.object().keys({//to be tested
                main:Joi.boolean().allow(''),
                address:Joi.string().email().required()
                });

        const contactSchema = Joi.object().keys({ //to be tested
                main: Joi.boolean().allow(''),
                description:Joi.string().max(25).regex(regex.common).allow(''),
                countryCode:Joi.number().integer().positive().max(999999).allow(''),
                areaCode:Joi.number().integer().positive().max(999999).allow(''),
                number:Joi.number().integer().positive().max(999999999999999).allow('')
                });

        const addressSchema = Joi.object().keys({//to be tested
                main:Joi.boolean().allow(''),
                description:Joi.string().max(50).regex(regex.common).allow(''),
                street:Joi.string().max(255).regex(regex.address).allow(''),
                city:Joi.string().max(50).regex(regex.common).allow(''),
                country:Joi.string().max(50).regex(regex.common).allow(''),
                province: Joi.string().max(100).regex(regex.common).allow(''),
                zipcode:Joi.number().positive().integer().min(1000).max(9999).allow(''),
                position:{
                        lat: Joi.number().max(85).min(-85).allow(''),
                        lng: Joi.number().max(180).min(-180).allow('')
                }
                });
        
        const governmentSchema = Joi.object().keys({//to be tested
        key:Joi.string().max(100).regex(regex.common).allow(''),
        info:Joi.string().max(100).regex(regex.common).allow('')
        });

        const companySchema = Joi.object().keys({
                tradename: Joi.string().regex(regex.commonAlphaNum).min(1).max(255).required(),
                ownershipType: Joi.string().valid(validDataLib.ownershipType).required(),
                owner: Joi.array().max(30).unique('profile').items(ownerSchema).single(),
                email:Joi.array().max(5).unique('address').items(emailSchema.required()).single().required(),
                contact:Joi.array().max(5).items(contactSchema).single(),
                address:Joi.array().max(3).unique('street').items(addressSchema).single(),
                government:Joi.array().max(30).unique('number').items(governmentSchema).single()     
        });

        return companySchema.validate(data);
}
function validateUpdate(data){

        const companySchema = Joi.object().keys({
                tradename: Joi.string().regex(regex.commonAlphaNum).min(1).max(255).required(),
                ownershipType: Joi.string().valid(validDataLib.ownershipType).required(),
        });

        return companySchema.validate(data);
}

function validateRegistration(data){
        const ownerSchema = Joi.object().keys({
                profile: Joi.objectId().required(),
                position: Joi.string().max(255).regex(regex.commonAlphaNum).required()
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

function validateId(data){

        const idSchema = Joi.object().keys({//to be tested
                id:Joi.objectId().allow('')
        });

        return idSchema.validate(data, {presence:'optional'});
}

function validateOwner(data){
        const ownerSchema = Joi.object().keys({
                profile: Joi.objectId().required(),
                position: Joi.string().max(255).regex(regex.commonAlphaNum).required()
        });

        const companySchema = Joi.object().keys({
                owner: Joi.array().max(30).unique('profile').items(ownerSchema.required()).single().required()  
        });

        return companySchema.validate(data);
}

function validateOwnerUpdate(data){
        const ownerSchema = Joi.object().keys({
                profile: Joi.objectId().required(),
                position: Joi.string().max(255).regex(regex.commonAlphaNum).required()
        });

        return ownerSchema.validate(data);
}