const config = require('config');
const   express = require('express'),
        router = express.Router({mergeParams: true});
//model
const   User = require('../models/user');
const   Profile = require('../models/profile');
const   Company = require('../models/company');
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
//constant variables set
const domainName = config.get('domainName');
const protocol = config.get('protocolEmail');

//TODO:cascade delete of account into Employment
//TODO: must have email        
//TODO: create RESEND account activation link for user - if no activation link was emailed
router.route('/signup').post(async (req,res,next)=>{//need further testing :TODO

    let result = Profile.validate(req.body.profile); //validate profile
    if(result.error){ return res.status(400).send(result.error);}
    
    result = User.validateSignup(req.body.user); //validate user
    if(result.error){ return res.status(400).send(result.error);}
    
    const userExist = await User.findOne({username: req.body.user.username}).exec();//check that username is unique
    if(userExist) {return res.status(400).send({message: 'Username already exist'});}
    
    //TODO: delete - no need for unique - multiple accounts
    const profileExist = await Profile.findOne({name: req.body.profile.name}).exec();//check that identity is unique - NO need to chek uniqueness - multiple accounts per person
    if(profileExist) {return res.status(400).send({message:'Profile already exist'});}
    
    const newProfile = new Profile(req.body.profile);
    const newUser = new User(req.body.user);
    
    //save profile id to user
    newUser.profile = newProfile._id;
    //set account type
    newUser.accountType = "profile";
    await newUser.hashPassword();
    
    const task = Fawn.Task();//save to database
    await task.save('profiles', newProfile)
    .save('users', newUser)
    .run();
    
    const token = newUser.genAuthToken();//generate token
    const decode = User.getTokenTime(token);

    //get email
    const email = newProfile.email.find(el=>{
        return el.main == true;
    });

    //TODO: create pre-formated email template - with just the body and title to be filled
    //format email to be sent
   let  mailOption = {
        from: `"PC Master race 👻" <no-reply@what.com>`, // sender address
        to: email.address, // list of receivers
        subject: 'Email confirmation and account activation', // Subject line
        // text: 'Hello world?', // plain text body
        html: `<b>Hello world?</b><br>
        <h1>url token for user ${newUser.username}</h1>
        <a target="_blank" rel="noopener noreferrer" href="${protocol}://${domainName}/user/activate?token=${token}">Follow link</a>` // html body
    };

    //might not AWAIT for email
    //send link via email - low time validity
    let sendStatus = await tools.email.send(mailOption);
    // console.log("sendStatus", sendStatus);
    
        return res.status(201)
                .header(config.get('token_header'), token)
                .header('exp', decode.exp)
                .send(newUser.response());//return sucess
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

    // console.log('response token', token);

        return res.status(200)
            .header(config.get('token_header'), token)
            .header('exp', decode.exp)
            .send(user.response());   
});

//TODO: check account type first before sending email to get email details
//send reset link for account reset, forgot password
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
            
            let email = null
            //TODO: check account type first
            if(user.accountType === "profile"){
                //get profile email
                const profile = await Profile.findOne({_id: user.profile}).exec();
                if(!profile) { return res.status(404).send({message: "Internal server error, could not match user with profile information."})}
                //get main email
                email = profile.email.find(el=>{return el.main == true});//find main email and set as email
            }
            if (user.accountType === "company"){
                //get company email
                const company = await Company.findOne({_id: user.company}).exec();
                if(!company) { return res.status(404).send({message: "Internal server error, could not match user with company information."})}
                //get main email
                email = company.email.find(el=>{return el.main == true});//find main email and set as email
            }
            // for staff - admin
            // if(user.accountType === "staff"){

            // }
            
            if(email === null){return res.status(500).send({message: "Internal server Error, could not retrieve email information"})}
            //format email to be sent as activation/confirmation
            mailOption = {
                from: `"PC Master race 👻" <no-reply@what.com>`, // sender address
                to: email.address, // list of receivers
                subject: 'Password reset', // Subject line
                // text: 'Hello world?', // plain text body
                html: `<b>Hello world?</b><br>
                <h1>url token for user ${user.username}</h1>
                <a target="_blank" href="${protocol}://${domainName}/reset?token=${token}">Follow link</a>` // html body
            };
            
            //send link via email - low time validity
            let sendStatus = await tools.email.send(mailOption);
            
            // console.log('sendstatus', sendStatus);
            res.status(200).send({message: sendStatus});
    next();

//change account password through reset token
}).put( async (req, res, next)=>{
    //validate req.body
    let {error} = User.validateResetPassword(req.body);
    if(error){return res.status(400).send({message: 'Bad request. could not validate entry'})}

    //decode token
    let decode = User.decode(req.body.token);

    //check if user exist - exist
    const user = await User.findById(decode._id).exec();
    if(!user) {return res.status(400).send({message: 'Bad request. User doesnt exist'});}

    //change password
    user.password = req.body.new;
    await user.hashPassword();
    await user.save();

    return res.status(200).send({message:'success'});

});


//get username
router.route('/me').get(auth.isAuth, async (req,res,next)=>{
    let user = await User.findById(req.user._id).populate('profile').populate('company').populate('employment._id').exec();

    //change to pick instead of omit - err in the side of safety
    return res.status(200).send(_.omit(user.toObject(), ['_id', 'profile._id', 'password' ]));


//edit username
}).put(auth.isAuth, async (req,res,next)=>{
    let data = req.body;

    let {error}= User.validateUser(data);//validate TODO change validation - doublecheck
    if(error){return  res.status(400).send(error);}

    let user = await User.findById(req.user._id).exec();
    if(!user){return res.status(404).send({message: 'Bad request'});}//if doesnt exist - return 404 error

    user.username = data.username;
    await user.save();

    res.status(200).send({message: 'Success'});

//delete account
}).delete(auth.isAuth, async (req,res,next)=>{
    let user = req.user;
    const task = Fawn.Task();

    const userExist = await User.findOne({_id: user._id}).exec();
    if(!userExist) {return res.status(400).send({message: 'Sever error: Could not delete account'});}

    //check account type
    if(userExist.accountType === "profile"){
        const profileExist = await Profile.findById(user.profile).exec();
        if(!profileExist) {return res.status(400).send('Sever error: Could not delete account');}
        //delete profile account
        task.remove('profiles', {_id: profileExist._id});
    }
    //check account type
    if (userExist.accountType === "company"){
        const companyExist = await Company.findById(user.company).exec();
        if(!companyExist) {return res.status(400).send('Sever error: Could not delete account');}
        //delete company acount
        task.remove('companies', {_id: companyExist._id});
    }

    task.remove('users', {_id: userExist._id})
        await task.run(); // use then?

    return res.status(200).send({message: 'Success'});
});


//chang password
router.route('/change_password').put(auth.isAuth, async (req,res,next)=>{
    let data = req.body;
    let {error}= User.validateChangePassword(data);
    if(error){return  res.status(400).send(error);}

    let user = await User.findById(req.user._id).exec();
    if(!user){return res.status(404).send({message: 'Bad request'});}//if doesnt exist - return 404 error

    user.password = data.new
    await user.hashPassword();//hash password
    await user.save();

    res.status(200).send({message: 'Success'});
})

//===========================company

router.route('/register').post(async (req,res,next)=>{

    //TODO: profile information save perhaps?... or tie in/link it

    let result = Company.validateRegistration(req.body.company); //validate company
    if(result.error){ return res.status(400).send(result.error);}
    
    result = User.validateSignup(req.body.user); //validate user
    if(result.error){ return res.status(400).send(result.error);}
    
    const userExist = await User.findOne({username: req.body.user.username}).exec();//check that username is unique
    if(userExist) {return res.status(400).send({message: 'Username already exist'});}

    const companyExist = await Company.findOne({tradename: req.body.company.tradename}).exec();
    if(companyExist){ return res.status(400).send({message: "Tradename already exist."});}
    
    //create instances
    const newCompany = new Company(req.body.company);
    const newUser = new User(req.body.user);
    
    //save company id to user
    newUser.company = newCompany._id;
    //set account type
    newUser.accountType = "company";
    await newUser.hashPassword();
    
    const task = Fawn.Task();//save to database
    await task.save('companies', newCompany)
    .save('users', newUser)
    .run();

    //create token
    const token = newUser.genAuthToken();//generate token
    const decode = User.getTokenTime(token); //decode exp time

    //get email
    const email = newCompany.email.find(el=>{
        return el.main == true;
    });
    
    //send email
    //TODO: create pre-formated email template - with just the body and title to be filled
    //format email to be sent
   let  mailOption = {
        from: `"PC Master race 👻" <no-reply@what.com>`, // sender address
        to: email.address, // list of receivers
        subject: 'Email confirmation and account activation', // Subject line
        // text: 'Hello world?', // plain text body
        html: `<b>Hello world?</b><br>
        <h1>url token for user ${newUser.username}</h1>
        <a target="_blank" rel="noopener noreferrer" href="${protocol}://${domainName}/user/activate?token=${token}">Follow link</a>` // html body
    };

    //might not AWAIT for email
    //send link via email - low time validity
    let sendStatus = await tools.email.send(mailOption);
    // console.log("sendStatus", sendStatus);

        return res.status(201)
                .header(config.get('token_header'), token)
                .header('exp', decode.exp)
                .send(newUser.response());//return sucess

});
module.exports = router;