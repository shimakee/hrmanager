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

    const userExist = await User.findOne({username: req.body.user.username});//check that username is unique
    if(userExist) {return res.status(400).send('Username already exist');}

    const profileExist = await Profile.findOne({name: req.body.profile.name});//check that identity is unique
    if(profileExist) {return res.status(400).send('Profile already exist');}
    
        const newProfile = new Profile(req.body.profile);
        const newUser = new User(req.body.user);

        newUser.profile = newProfile._id;
        await newUser.hashPassword();
        
        const task = new Fawn.Task();//save to database
        task.save('profiles', newProfile)
        .save('users', newUser)
        .run();

        const token = newUser.genAuthToken();//generate token

        return res.status(201).header(process.env.RESPONSETOKENHEADER, token).send('Success');//return sucess
});

router.route('/login').post(async (req,res,next)=>{//need further testing :TODO
    const userReq = req.body;
    const {error} = User.validate(userReq); //validate user
    if(error) {return res.status(400).send(error);}

        const user = await User.findOne({username: userReq.username}).exec();//username exist
        if(!user) {return res.status(400).send('Invalid username or password.');}

        const isValidPassword = await user.matchPassword(userReq.password);//match password
        if(!isValidPassword){return res.status(400).send('Invalid username or password.');}

        const token = user.genAuthToken();//generate token

        return res.status(200).header(process.env.RESPONSETOKENHEADER, token).send(_.pick(user,['username']));   
});

router.route('/reset').post(async (req,res,next)=>{
    //validate-valid 
    let {error} = User.validateUser(req.body);//validate username
    if(error){ return res.status(400).send(error);}
        //check if user exist - exist
        const user = await User.findOne({username: req.body.username});
        if(!user){return res.status(400).send('Bad request.');}
        
            //check if email is available
                //check for main email && is valid
                    //create password hash with date/time validity
                    user.password = 'aaAA11!!!!' //TODO: random generate word
                    await user.hashPassword();
                    //change password
                    const result = await User.updateOne({username: user.username}, {password: user.password});
                    res.status(200).send(result);
                    //send password as email to email account
                    //OR - send link with authtoken - time to live 30mins
        //does not exist - return message
    //invalid - return message
    next();
});

router.route('/user/me').get(auth.isAuth, async (req,res,bext)=>{
    return res.status(200).send(req.user.username);

}).put(auth.isAuth, async (req,res,bext)=>{
    let user = req.user;
    let data = req.body;

    let {error} = User.validate(data);//validate
    if(error){return  res.status(400).send(error);}

    //if doesnt exist - return 404 error
        data = _.omit(data, ['_id']); //prevent id change
        if(data.password){ data.password = await User.hashPassword(data.password);}//hash password
        user = await User.updateOne({_id: user._id}, data);
        res.status(200).send('Success');
}).delete(auth.isAuth,async (req,res,next)=>{
    let user = req.user;

    const userExist = await User.findOne({_id: user._id});
    if(!userExist) {return res.status(400).send('Sever error: Could not delete account');}
        const task = new Fawn.Task();//save to database
        task.remove('profiles', {_id: user.profile})
        .remove('users', {_id: user._id})
        .run();

        return res.status(200).send('Success');
});

//deactivate account "deactivate/me"
//reactivate account

//edit profile info
module.exports = router;