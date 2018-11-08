const   mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        ObjId       = Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');//validator
        Joi.objectId = require('joi-objectid')(Joi);

        const ownerLimit = 50;
        const businessLimit = 1000;
        const employeesLimit = 5000;
        const picsLimit = 50;
        const addressLimit = 3;
        const contactLimit = 5;
        const emailLimit = 5;
        const governmentLimit = 50;

var company = new Schema({
    // username: {type: String, required: [true, "Username required"], unique: true, dropDups: true
    //         , match: [regex.username, 'Invalid input on username']},
    // password: {type: String, required: [true, "Password required"]
    //         , match: [regex.password, 'Invalid input on password']},
    authenticated: {type: Boolean, default: false},
    tradename: {type: String, required: [true, 'Tradename required'], 
    // unique: true, dropDups: true,
            },
            //description: {type:String}
    ownershipType: {type: String, enum: ['sole proprietor', 'partnership', 'corporation']},
    owner: [{profile: {type: ObjId, ref: 'Profile'},
        position: {type: String}}],
    businesses: [{business: {type: ObjId, ref: 'Business'}}],
    picDir: {type: String}, //by default is already set at config - no need to save it yet
    pics:[{filename: {type: String},
        path: {type: String},
        encoding: {type: String},
        mimetype: {type: String},
        size: {type: Number}}],
    companyPicName: {type: String,}, //set which pic as profile
    contact:    [{main: {type: Boolean, default: false},
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
    employees: [{employee: {type: ObjId, ref: 'Employee'}}]
//     ,
//     employees: [{profile: {type: ObjId, ref: 'Profile'}}]
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
company.statics.validateUserSignup = function(data){
        return validateUserSignup(data);
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
company.statics.validateAddress = function(data){
        return validateAddress(data);
}
company.statics.validateContact = function(data){
        return validateContact(data);
}
company.statics.validateGov = function(data){
        return validateGov(data);
}
company.statics.validateEmail = function(data){
        return validateEmail(data);
}

module.exports = mongoose.model('Company', company);

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
                owner: Joi.array().max(30).unique('profile').items(ownerSchema).single().allow(''),
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

function validateAddress(data){

        const addressSchema = Joi.object().keys({//to be tested
            _id: Joi.objectId().allow(''),
            main:Joi.boolean().default(false),
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
    
        const profileSchema = Joi.object().keys({//to be tested
            address: Joi.array().max(3).unique('street').items(addressSchema.required()).single().required()
        });
    
        return profileSchema.validate(data);
    }

    function validateContact(data){

        const contactSchema = Joi.object().keys({ //to be tested
            main: Joi.boolean().allow(''),
            description:Joi.string().max(25).regex(regex.common),
            countryCode:Joi.number().integer().positive().max(999999).allow(''),
            areaCode:Joi.number().integer().positive().max(999999).allow(''),
            number:Joi.number().integer().positive().max(999999999999999)
        });
    
        return contactSchema.validate(data);
    }

    function validateGov(data){

        const governmentSchema = Joi.object().keys({//to be tested
            key:Joi.string().max(100).regex(regex.common),
            info:Joi.string().max(100).regex(regex.commonAlphaNum)
        });
    
        return governmentSchema.validate(data);
    }

    function validateEmail(data){
        const emailSchema = Joi.object().keys({//to be tested
            main:Joi.boolean().allow('').default(false),
            address:Joi.string().email().required()
        });
    
        // const emailArraySchema = Joi.object().keys({//to be tested
        //     email:Joi.array().max(5).unique('address').items(emailSchema.required()).single().required()
        // });
    
        return emailSchema.validate(data);
    }

    function validateUserSignup(data){
        const userSchema = Joi.object().keys({//to be tested
            _id: Joi.objectId().allow(''),
            activity:Joi.boolean().allow(''),
            username:Joi.string().alphanum().min(8).max(30).required(),
            password:Joi.string().min(10).max(72).required(),
            passConfirm:Joi.string().min(10).max(72).required()
        });
    
        if(data.password !== data.passConfirm){return {error: {message: 'Password confirmation does not match', name: "ValidationError"}}};
       
        const {error} = validatePassword(data.password);
        if(error) return {error};
        
        return userSchema.validate(data);
    
    }