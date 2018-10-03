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
    address:    { street: {type: String},
                city:{type:String},
                country:{type:String},
                province: {type:String},
                zipcode: {type: Number, min: 1000, max: 9999},
                position:{
                    lat:{type: Number},
                    lng: {type:Number}
                }},
    contact:    [{main: {type: Boolean, default: false},
        description: {type: String}, 
        countryCode: {type: Number,min:0, max:999999}, 
        areaCode: {type: Number, min:0, max:999999}, 
        number: {type: Number, min:0, max:999999999999999}}],
    email:      [{main: {type: Boolean, default: false},
            address: {type: String}}],
    government: [{key: {type: String},  
            info: {type: String}}],
});

const employeesLimit = 5000;
const picsLimit = 50;
const addressLimit = 3;
const contactLimit = 5;
const emailLimit = 5;
const governmentLimit = 50;
const businessNumberLimit = 5000

//static variables - limits
business.statics.employeesLimit = employeesLimit;
business.statics.picsLimit = picsLimit;
business.statics.addressLimit = addressLimit;
business.statics.contactLimit = contactLimit;
business.statics.emailLimit = emailLimit;
business.statics.governmentLimit = governmentLimit;
business.statics.businessNumberLimit = businessNumberLimit;

//static methods

business.statics.validate= function(data){
    return validateBusiness.general(data);
}

module.exports = mongoose.model('Business', business);

const validateBusiness = {
    general(data){
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
}