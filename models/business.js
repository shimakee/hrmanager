const   mongoose    = require ('mongoose'),
        Schema      = mongoose.Schema,
        ObjId       = Schema.Types.ObjectId,
        regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const   Joi = require('joi');
        Joi.objectId = require('joi-objectid')(Joi);

var business    = new Schema ({
    company: {type: ObjId, ref: 'Company', required: [true, 'Owner required']},
    tradename: {type: String, required: [true, 'Tradename required']
    // , unique: true, dropDups: true
},
    employees: [{
            // employment: {type: ObjId, ref: 'Employment'},
                profile: {type: ObjId, ref: 'Profile'}}],
    contact:    [{main: {type: Boolean, default: false}, //TODO ObjId reference to new contact schema
        description: {type: String}, 
        countryCode: {type: Number,min:0, max:999999}, 
        areaCode: {type: Number, min:0, max:999999}, 
        number: {type: Number, min:0, max:999999999999999}}],
    email:      [{main: {type: Boolean, default: false},
            address: {type: String}}],
    address:    { street: {type: String},
            city:{type:String},
            country:{type:String},
            province: {type:String},
            zipcode: {type: Number, min: 1000, max: 9999},
            position:{
                lat:{type: Number},
                lng: {type:Number}
            }},
    government: [{key: {type: String},  
            info: {type: String}}],
});

business.statics.validate= function(data){
    return validate(data);
}
business.statics.validateId= function(data){
    return validateId(data);
}
business.statics.validateContact= function(data){
    return validateContact(data);
}
business.statics.validateEmail= function(data){
    return validateEmail(data);
}
business.statics.validateGov= function(data){
    return validateGov(data);
}


module.exports = mongoose.model('Business', business);

function validate(data){
    const businessSchema = Joi.object().keys({
        tradename: Joi.string().regex(regex.commonAlphaNum).min(1).max(255).required(),
        // company: Joi.objectId().required(),
        address:{street: Joi.string().max(255).regex(regex.address).required(),
        city:Joi.string().max(50).regex(regex.common).required(),
        country:Joi.string().max(50).regex(regex.common).required(),
        province: Joi.string().max(100).regex(regex.common).required(),
        zipcode:Joi.number().positive().integer().min(1000).max(9999).allow(''),
        position:{
            lat: Joi.number().max(85).min(-85).allow(''),
            lng: Joi.number().max(180).min(-180).allow('')
        }}
    });

    return businessSchema.validate(data);
}

function validateId(data){

    const idSchema = Joi.object().keys({//to be tested
            id:Joi.objectId().allow('')
    });

    return idSchema.validate(data, {presence:'optional'});
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
    // const businessEmailSchema = Joi.object().keys({//to be tested
    //     email:Joi.array().max(5).unique('address').items(emailSchema.required()).single().required(),
    //     businessId: Joi.objectId().required()
    // });

    return emailSchema.validate(data);
}