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
const tools = require('../util/tools');
// const jwt = require('jsonwebtoken');
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

    // console.log('decode', decode);

    //format email to be sent
   let  mailOption = {
        from: `"PC Master race 👻" <no-reply@what.com>`, // sender address
        to: req.body.profile.email.address, // list of receivers
        subject: 'Email confirmation and account activation', // Subject line
        // text: 'Hello world?', // plain text body
        html: `<b>Hello world?</b><br>
        <h1>url token for user ${decode.username}</h1>
        <a target="_blank" rel="noopener noreferrer" href="http://localhost/user/activate?token=${token}">Follow link</a>` // html body
    };

    //send link via email - low time validity
    let sendStatus = await tools.email.send(mailOption);
    console.log("sendStatus", sendStatus);
    
        return res.status(201)
                .header(config.get('token_header'), token)
                .header('exp', decode.exp)
                .send({message: 'Success'});//return sucess
});

router.route('/activate').get(async (req,res,next)=>{
    let token = req.query.token;

    if(!token){
        res.status(400).send({message: 'Bad request. No token.'});
    }else{
        let decoded = User.verifyToken(token);
        
        if(!decoded.isValid){
            res.status(400).send({message: 'Bad request. Invalid token.'});
        }else{
            
            const user = await User.findOne({_id: decoded.info._id}).exec();//username exist
            if(!user) {return res.status(404).send({message: 'Bad request. User does not exist'});}

            user.activity = true;
            await user.save();

            res.status(200).redirect('/login');
        }
    }
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

router.route('/reset').post(async (req,res,next)=>{//TODO: send email
    //validate-valid 
    let {error} = User.validateUser(req.body);//validate username
    if(error){ return res.status(400).send(error);}

    //check if user exist - exist
    const user = await User.findOne({username: req.body.username}).exec();
    if(!user) {return res.status(400).send({message: 'Bad request. Username doesnt exist'});}

            //generate User jwt key to be used as reset link get request
            const token = user.genAuthToken('30m');
            let decode = User.getTokenTime(token);
            
            //get profile email
            const profile = await Profile.findOne({_id: user.profile}).exec();
            if(!profile) { return res.status(404).send({message: "Internal server error, could not match user with profile information."})}
            //get main email
            let email = profile.email.find(el=>{return el.main == true});
            
            //format email to be sent
            mailOption = {
                from: `"PC Master race 👻" <no-reply@what.com>`, // sender address
                to: email.address, // list of receivers
                subject: 'Password reset', // Subject line
                // text: 'Hello world?', // plain text body
                html: `<b>Hello world?</b><br>
                <h1>url token for user ${user.username}</h1>
                <a target="_blank" href="http://localhost/reset?token=${token}">Follow link</a>` // html body
            };
            
            //send link via email - low time validity
            let sendStatus = await tools.email.send(mailOption);
            
            // console.log('sendstatus', sendStatus);
            res.status(200).send({message: sendStatus});

                    // user.password = 'aaAA11!!!!';
                    // await user.hashPassword();
                    //change password
                    // const result = await User.updateOne({username: user.username}, {password: user.password}).exec();
                    // res.status(200).send({message: 'Success'});
                    //send password as email to email account
                    //OR - send link with authtoken - time to live 30mins
        //does not exist - return message
    //invalid - return message
    next();
}).put( async (req, res, next)=>{
    //validate req.body
    let {error} = User.validateResetPassword(req.body);
    if(error){return res.status(400).send({message: 'Bad request. could not validate entry'})}

    //decode token
    let decode = User.decode(req.body.token);

    //check if user exist - exist
    const user = await User.findOne({username: decode.username}).exec();
    if(!user) {return res.status(400).send({message: 'Bad request. Username doesnt exist'});}

    //change password
    user.password = req.body.new;
    await user.hashPassword();
    await user.save();
    res.status(200).send({message:'success'});

    next();
});

//TODO: create get link for forgot password
    //check that req parameter/query exist
    //validate key sent on req.query.kay
    //create header - jwt token - temporary 1 hour
    //redirect to change pssword

//TODO: recive change password from forgot
    //check req parameters/query exist - or hidden input token as part of post
    //validate parameters is valid or token is valid
    //check parameters/headers/token is authentic

    //validate req.body
    //change password
    //hashpassword
    //return success

router.route('/me').get(auth.isAuth, (req,res,next)=>{
    return res.status(200).send({username: req.user.username});

}).put(auth.isAuth, async (req,res,next)=>{
    let data = req.body;

    let {error}= User.validateUser(data);//validate TODO change validation - doublecheck
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