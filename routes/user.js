const config = require('config');
const   express = require('express'),
        router = express.Router({mergeParams: true});
//model
const   User = require('../models/user');
const   Profile = require('../models/profile');
//middleware
const auth = require('../middleware/auth');
//utilities
const Fawn = require('fawn');
const   _ = require('lodash');
const jwt = require('jsonwebtoken');
        //status 200 - ok
        //201 -resource created
        //status 400 - Bad request
        //401 unauthorized
        //403 forbidden
        //status 404 - object not found

router.route('/signup').post(async (req,res,next)=>{//need further testing :TODO
    let result = Profile.validate(req.body.profile); //validate profile
    if(result.error){ return res.status(400).send(result.error);}
    
    result = User.validateSignup(req.body.user); //validate user
    if(result.error){ return res.status(400).send(result.error);}
    
    const userExist = await User.findOne({username: req.body.user.username}).exec();//check that username is unique
    if(userExist) {return res.status(400).send({message: 'Username already exist'});}
    
    const profileExist = await Profile.findOne({name: req.body.profile.name}).exec();//check that identity is unique
    if(profileExist) {return res.status(400).send({message:'Profile already exist'});}
    
    const newProfile = new Profile(req.body.profile);
    const newUser = new User(req.body.user);
    
    newUser.profile = newProfile._id;
    await newUser.hashPassword();
    
    const task = Fawn.Task();//save to database
    await task.save('profiles', newProfile)
    .save('users', newUser)
    .run();
    
    const token = newUser.genAuthToken();//generate token
    const decode = User.getTokenTime(token);
    
        return res.status(201)
                .header(config.get('token_header'), token)
                .header('exp', decode.exp)
                .send({message: 'Success'});//return sucess
});

router.route('/login').post(async (req,res,next)=>{//need further testing :TODO
    const userReq = req.body;
    const {error} = User.validate(userReq); //validate user
    if(error) {return res.status(400).send(error);}

        const user = await User.findOne({username: userReq.username}).exec();//username exist
        if(!user) {return res.status(404).send({message: 'Invalid username or password.'});}

        const isValidPassword = await user.matchPassword(userReq.password);//match password
        if(!isValidPassword){return res.status(400).send({message: 'Invalid username or password.'});}

        const token = user.genAuthToken();//generate token
        const decode = User.getTokenTime(token);

        return res.status(200)
            .header(config.get('token_header'), token)
            .header('exp', decode.exp)
            .send(_.pick(user,['username']));   
});

router.route('/reset').post(async (req,res,next)=>{
    //validate-valid 
    let {error} = User.validateUser(req.body);//validate username
    if(error){ return res.status(400).send(error);}
        //check if user exist - exist
        const user = await User.findOne({username: req.body.username}).exec();
        if(!user) {return res.status(400).send({message: 'Bad request. Username doesnt exist'});}

            //check if email is available
                //check for main email && is valid
                    //create password hash with date/time validity
                    user.password = 'aaAA11!!!!' //TODO: random generate word
                    await user.hashPassword();
                    //change password
                    const result = await User.updateOne({username: user.username}, {password: user.password}).exec();
                    res.status(200).send({message: 'Success'});
                    //send password as email to email account
                    //OR - send link with authtoken - time to live 30mins
        //does not exist - return message
    //invalid - return message
    next();
});

router.route('/me').get(auth.isAuth, (req,res,next)=>{
    return res.status(200).send({username: req.user.username});

}).put(auth.isAuth, async (req,res,next)=>{
    let data = req.body;

    let {error}= User.validateUser(data);//validate TODO change validation
    if(error){return  res.status(400).send(error);}

    let user = await User.findOne({_id: req.user._id}).exec();
    if(!user){return res.status(404).send({message: 'Bad request'});}//if doesnt exist - return 404 error

        user.username = data.username;
        await user.save();

    res.status(200).send({message: 'Success'});
}).delete(auth.isAuth, async (req,res,next)=>{
    let user = req.user;

    const userExist = await User.findOne({_id: user._id}).exec();
    if(!userExist) {return res.status(400).send({message: 'Sever error: Could not delete account'});}

    const profileExist = await Profile.findOne({_id: user.profile}).exec();
    if(!profileExist) {return res.status(400).send('Sever error: Could not delete account');}

        const task = Fawn.Task();
        await task.remove('profiles', {_id: profileExist._id})
         .remove('users', {_id: userExist._id})
         .run();

        return res.status(200).send({message: 'Success'});
});

router.route('/change_password').put(auth.isAuth, async (req,res,next)=>{
    let data = req.body;
    let {error}= User.validateChangePassword(data);
    if(error){return  res.status(400).send(error);}

    let user = await User.findOne({_id: req.user._id}).exec();
    if(!user){return res.status(404).send({message: 'Bad request'});}//if doesnt exist - return 404 error

        user.password = data.new
        await user.hashPassword();//hash password
        await user.save();

    res.status(200).send({message: 'Success'});
})

module.exports = router;