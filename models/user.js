const   Joi = require('joi');//validator
const PassComplexity = require('joi-password-complexity'); //password complexity joi object
const bcrypt = require('bcrypt');//password hashing
const jwt = require('jsonwebtoken');
const   mongoose = require('mongoose'),
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

const user = new Schema({
    activity: {type: Boolean, default: true},
    username: {type: String,min:8, max:30, required: [true, "Username required"], unique: true, dropDups: true},
    password: {type: String,max:1024, required: [true, "Password required"]},
    profile: {type: ObjId, ref: 'Profile', required: [true, "Profile information required"]}
    // employment: [{type: ObjId, ref: 'Employment'}]
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

user.statics.validateSignup = function(data){
    return validateUserSignup(data);
}

user.statics.hashPassword= async function(password, saltRounds = 10){

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

user.methods.hashPassword= async function(saltRounds = 10){

    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
}

user.methods.matchPassword = async function(passwordInput){
    return await bcrypt.compare(passwordInput, this.password);
}

user.methods.genAuthToken = function(){
    const token = jwt.sign({_id:this._id, 
                            username: this.username,
                            profile: this.profile}, 
    process.env.TOKENKEY,
    {expiresIn:'1h'});
    return token;
}

module.exports = mongoose.model('Users', user);

function validateUser(data){
    const userSchema = Joi.object().keys({//to be tested
        username:Joi.string().alphanum().min(8).max(30).required()
    });

    return userSchema.validate(data);

}

function validate(data){
    const userSchema = Joi.object().keys({//to be tested
        _id:Joi.objectId().allow(''),
        username:Joi.string().alphanum().min(8).max(30).required(),
        password:Joi.string().min(10).max(72).required(),
        profile:Joi.objectId().allow('')
    });

    const {error} = validatePassword(data.password);
    if(error) return {error};

    return userSchema.validate(data);
}

function validatePassword(data){
    return Joi.validate(data, new PassComplexity(passwordConfig));
}

function validateUserSignup(data){
    const userSchema = Joi.object().keys({//to be tested
        activity:Joi.boolean(),
        username:Joi.string().alphanum().min(8).max(30).required(),
        password:Joi.string().min(10).max(72).required(),
        passConfirm:Joi.string().min(10).max(72).required(),
        profile:Joi.objectId()
    });

    if(data.password !== data.passConfirm) return {error: 'Password confirmation does not match'};
   
    const {error} = validatePassword(data.password);
    if(error) return {error};
    
    return userSchema.validate(data);

}