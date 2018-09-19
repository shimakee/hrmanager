const config = require('config');
const   Joi = require('joi');//validator
    Joi.objectId = require('joi-objectid')(Joi);
const PassComplexity = require('joi-password-complexity'); //password complexity joi object
const bcrypt = require('bcrypt');//password hashing
const jwt = require('jsonwebtoken');
const   mongoose = require('mongoose');
const validDataLib = require('../util/validDataLibrary');

// const _ = require('lodash');
//         passportLocalMongoose = require('passport-local-mongoose'),
        Schema = mongoose.Schema,
        ObjId = mongoose.Schema.Types.ObjectId;

const passwordConfig = {//setting password complexity requirements
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
}

const employmentLimit = 5000;

const user = new Schema({
    activity: {type: Boolean, default: false},
    username: {type: String,min:8, max:30, required: [true, "Username required"], unique: true, dropDups: true},
    password: {type: String,max:1024, required: [true, "Password required"]},
    profile: {type: ObjId, ref: 'Profile'},
    employment: [{_id:{type: ObjId, ref: 'Employee'}}],
    // customer: [{type: ObjId, ref: 'Customer'}] // this should be in company or business - better in business
    company: {type: ObjId, ref: "Company"},
    //role: [{type: ObjId, ref:'Role'}] //access control
    accountType: {type: String, enum: validDataLib.accountType, required: [true, "Account type required"]} //client user, client company, or staff
});

// user.plugin(passportLocalMongoose,{
//     limitAttempts: true,
//     maxAttemps: 3,
//     interval: 120000,
//     hashField: 'password'
// });

user.statics.validate = function(data){
    return validate(data);
}

user.statics.validateUser = function(data){
    return validateUser(data);
}

user.statics.validatePassword = function(data){
    return validatePassword(data);
}

user.statics.validateSignup = function(data){
    return validateUserSignup(data);
}

user.statics.validateChangePassword = function(data){
    return validateChangePassword(data);
}

user.statics.validateResetPassword = function(data){
    return validateResetPassword(data);
}

user.statics.getTokenTime = function(token){
    const decode = jwt.decode(token, config.get('token'));
    return {iat:decode.iat, exp:decode.exp};
}

user.statics.decode = function(token){
    const decode = jwt.decode(token, config.get('token'));
    return decode;
}

user.statics.verifyToken = function(token){
    let decoded;
    try{
        decoded = jwt.verify(token, config.get('token'));
    }catch(ex){
        return {isValid: false, error: {message: 'JWT invalid.'}, info: null};
    }
    return {isValid:true, error: null, info: decoded}
}

user.methods.hashPassword= async function(saltRounds = 10){

    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
}

user.methods.matchPassword = function(passwordInput){
    return bcrypt.compare(passwordInput, this.password);
}

user.methods.genAuthToken = function(time = '1h'){
    const token = jwt.sign({_id:this._id, 
                            username: this.username,
                            profile: this.profile, // check accoutn type first
                            company: this.company, //check accoutn type first
                            employment: this.employment,
                            accountType: this.accountType}, 
    config.get('token'),
    {expiresIn:time});
    return token;
}

// const skipInit = process.env.NODE_ENV === 'test';
module.exports = mongoose.model('User', user);

//==========================================fnctions
function validateUser(data){
    const userSchema = Joi.object().keys({//to be tested
        username:Joi.string().alphanum().min(8).max(30).required()
    });
    return userSchema.validate(data);
}

function validatePassword(data){
    return Joi.validate(data, new PassComplexity(passwordConfig));
}

function validate(data){
    const userSchema = Joi.object().keys({//to be tested
        _id:Joi.objectId().allow(''),
        username:Joi.string().alphanum().min(8).max(30).required(),
        password:Joi.string().min(10).max(72).required(),
        accountType: Joi.string().valid(validDataLib.accountType).required(),
        profile:Joi.objectId().allow(''),
        company: Joi.objectId().allow('')
    });

    const {error} = validatePassword(data.password);
    if(error) return {error};

    return userSchema.validate(data, {presence:'optional'});
}

function validateUserSignup(data){
    const userSchema = Joi.object().keys({//to be tested
        _id: Joi.objectId().allow(''),
        activity:Joi.boolean().allow(''),
        username:Joi.string().alphanum().min(8).max(30).required(),
        password:Joi.string().min(10).max(72).required(),
        passConfirm:Joi.string().min(10).max(72).required(),
        profile:Joi.objectId()
    });

    if(data.password !== data.passConfirm){return {error: {message: 'Password confirmation does not match', name: "ValidationError"}}};
   
    const {error} = validatePassword(data.password);
    if(error) return {error};
    
    return userSchema.validate(data);

}

function validateChangePassword(data){
    const userSchema = Joi.object().keys({//to be tested
        old:Joi.string().min(10).max(72).required(),
        new:Joi.string().min(10).max(72).required(),
        newConfirm:Joi.string().min(10).max(72).required()
    });

    if(data.new !== data.newConfirm){return {error: {message: 'Password confirmation does not match', name: "ValidationError"}}};

    const {error} = validatePassword(data.new);
    if(error) return {error};

    return userSchema.validate(data);
}

function validateResetPassword(data){
    const userSchema = Joi.object().keys({//to be tested
        new:Joi.string().min(10).max(72).required(),
        newConfirm:Joi.string().min(10).max(72).required(),
        token: Joi.string().required()
    });

    try{
        const decoded = jwt.verify(data.token, config.get('token'));
    }catch(ex){
        return {error: {message: 'JWT invalid.'}};
    }

    if(data.new !== data.newConfirm){return {error: {message: 'Password confirmation does not match', name: "ValidationError"}}};

    const {error} = validatePassword(data.new);
    if(error) return {error};

    return userSchema.validate(data);
}