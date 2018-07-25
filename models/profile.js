const   Joi         = require('joi');
        Joi.objectId = require('joi-objectid')(Joi);
const   mongoose    = require ('mongoose')
,       Schema      = mongoose.Schema
,       ObjId       = mongoose.Schema.Types.ObjectId
const   regex       = require('../util/regex'),
        validDataLib = require('../util/validDataLibrary');

const profile  = new Schema({
    alive: {type: Boolean, required: true, default: true},
    name:   {
            first: {type: String, required: [true, "Need first name"]},
            middle: {type: String},
            maiden: {type: String, 
                required: [function (){ 
                    return this.gender === 'female' && this.civilStatus !== 'single';
                }, 'Maiden name is required for non single female']},
            last: {type: String, required: [true, "Need last name"]},
            suffix: {type: String}
        //     ,unique: true, dropDups: true
        },
    gender: {type: String, enum: validDataLib.gender, required: [true, 'Need to select gender']},
    birthdate: {type: Date},
    nationality: {type: String},
    civilStatus: {type: String, required: true, default: 'single', enum: ['single', 's',
                                                                        'widowed', 'widow', 'w',
                                                                        'married', 'm',
                                                                        'annulled', 'a',
                                                                        'divorced', 'd']},

    spouse: {type: ObjId, ref: 'Profile'},
    parents:     {mother: {type: ObjId, ref: 'Profile'},
                father: {type: ObjId, ref: 'Profile'}},

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
                province: {type:String},
                zipcode: {type: Number, min: 1000, max: 9999},
                position:{
                    lat:{type: Number},
                    lng: {type:Number}
                }}],
    government: [{key: {type: String},  
                number: {type: Number, max:99999999999999999999}}]
});

profile.statics.validate = function(data){
    return validateProfile(data);
}

profile.statics.validateUpdate = function(data){
    return validateUpdate(data);
}

profile.statics.validateId = function (data){
    return validateId(data);
}

profile.statics.validateAddress = function (data){
    return validateAddress(data);
}

profile.methods.getFullName = function(){
    let name = this.name;
    let fullName = [];
    for (const key in name) {
        if (name.hasOwnProperty(key)) {
            const element = name[key];
            if(element){
                fullName.push(element);
            }
        }
    }

    return fullName.join(' ');
}

// const skipInit = process.env.NODE_ENV === 'test';
module.exports = mongoose.model('Profile', profile);

//============================================================functions

function validateProfile(data){
    const contactSchema = Joi.object().keys({ //to be tested
        main: Joi.boolean().allow(''),
        description:Joi.string().max(25).regex(regex.common).allow(''),
        countryCode:Joi.number().integer().positive().max(999999).allow(''),
        areaCode:Joi.number().integer().positive().max(999999).allow(''),
        number:Joi.number().integer().positive().max(999999999999999).allow('')
    });

    const emailSchema = Joi.object().keys({//to be tested
        main:Joi.boolean().allow(''),
        address:Joi.string().email().allow('')
    });

    const addressSchema = Joi.object().keys({//to be tested
        main:Joi.boolean().allow(''),
        description:Joi.string().max(50).regex(regex.common).allow(''),
        street:Joi.string().max(255).regex(regex.address).allow(''),
        city:Joi.string().max(50).regex(regex.common).allow(''),
        province: Joi.string().max(100).regex(regex.common).allow(''),
        zipcode:Joi.number().positive().integer().min(1000).max(9999).allow(''),
        position:{
            lat: Joi.number().max(85).min(-85).allow(''),
            lng: Joi.number().max(180).min(-180).allow('')
        }
    });

    const governmentSchema = Joi.object().keys({//to be tested
        key:Joi.string().max(100).alphanum().allow(''),
        number:Joi.number().positive().integer().max(99999999999999999999).allow('')
    });

    const profileSchema = Joi.object().keys({//to be tested

        _id:Joi.objectId().allow(''),
        alive:Joi.boolean().allow(''),
        name:{
            first:Joi.string().max(50).regex(regex.common).required(),
            middle:Joi.string().max(50).regex(regex.common).allow(''),
            maiden:Joi.string().max(50).regex(regex.common).allow(''),
            last:Joi.string().max(50).regex(regex.common).required(),
            suffix: Joi.string().max(50).regex(regex.common).allow('')
        },
        gender:Joi.string().valid(validDataLib.gender).insensitive().required(),
        birthdate:Joi.date().min('1-1-1900').max('now').allow(''),
        nationality:Joi.string().max(30).regex(regex.common).allow(''),
        civilStatus:Joi.string().valid(validDataLib.civilStatus).insensitive().required(),
        spouse:Joi.objectId().allow(''),
        parents:{
            mother:Joi.objectId().allow(''),
            father:Joi.objectId().allow(''),
        },
        contact:Joi.array().max(5).unique('number').items(contactSchema).single(),
        email:Joi.array().max(5).unique('address').items(emailSchema).single(),
        address:Joi.array().max(3).unique('street').items(addressSchema).single(),
        government:Joi.array().max(30).unique('number').items(governmentSchema).single()
    });

    return profileSchema.validate(data, {allowUnknown: true, presence:'optional'});
}

function validateUpdate(data){

    const profileSchema = Joi.object().keys({//to be tested
        name:{
            first:Joi.string().max(50).regex(regex.common).required(),
            middle:Joi.string().max(50).regex(regex.common).allow(''),
            maiden:Joi.string().max(50).regex(regex.common).allow(''),
            last:Joi.string().max(50).regex(regex.common).required(),
            suffix: Joi.string().max(50).regex(regex.common).allow('')
        },
        gender:Joi.string().valid(validDataLib.gender).insensitive().required(),
        birthdate:Joi.date().min('1-1-1900').max('now').allow(''),
        nationality:Joi.string().max(30).regex(regex.common).allow(''),
        civilStatus:Joi.string().valid(validDataLib.civilStatus).insensitive().required()
    });

    return profileSchema.validate(data, {allowUnknown: true, presence:'optional'});
}

function validateId(data){

    const profileSchema = Joi.object().keys({//to be tested
        id:Joi.objectId().allow('')
    });

    return profileSchema.validate(data, {allowUnknown: true, presence:'optional'});
}

function validateAddress(data){

    const addressSchema = Joi.object().keys({//to be tested
        main:Joi.boolean().default(false),
        description:Joi.string().max(50).regex(regex.common).allow(''),
        street:Joi.string().max(255).regex(regex.address).allow(''),
        city:Joi.string().max(50).regex(regex.common).allow(''),
        province: Joi.string().max(100).regex(regex.common).allow(''),
        zipcode:Joi.number().positive().integer().min(1000).max(9999).allow(''),
        position:{
            lat: Joi.number().max(85).min(-85).allow(''),
            lng: Joi.number().max(180).min(-180).allow('')
        }
    });

    const profileSchema = Joi.object().keys({//to be tested
        address:Joi.array().max(3).unique('street').items(addressSchema).single()
    });

    return profileSchema.validate(data, {allowUnknown: true, presence:'optional'});
}