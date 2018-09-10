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


//find things necessary to be populated upon request
//create middleware to check if profile id is present in req.user after authentication
//get user profile info
router.route('/me').get(auth.isAuth, async (req,res,next)=>{
    const user = req.user;
        let  profile = await Profile.findById(user.profile).populate('relatives.profile').exec();
        if(!profile){return res.status(400).send({message: 'Bad request.'});}//remove error handling because of wrapper?
        
        //change _ method to pick instead of omit
        profile = _.pick(profile.toObject(), ['name', 'gender', 'birthdate', 'nationality', 'civilStatus', 'pics', 'profilePicName', 'relatives', 'contact', 'email', 'address', 'government']);//remove important properties
        res.status(200).send(profile);

//edit user profile info
}).put(auth.isAuth, async (req,res,next)=>{ 
    const user = req.user;
    let data = req.body;

    let {error} = Profile.validateUpdate(data);
    if(error){return  res.status(400).send(error);} //TODO remove because of wrapper

    
    const profile = await Profile.findOne({_id: user.profile}).exec();//find profile if existing
    if(!profile){return res.status(400).send({message: "Bad request."})}

    data = _.omit(data, ['_id']); //prevent id change
    let result = await Profile.updateOne({_id: user.profile}, data).exec();
    res.status(200).send({message: 'Success', result: result});

//delete user profile info
}).delete(auth.isAuth, async (req,res,next)=>{
    let user = req.user;

    const userExist = await User.findOne({_id: user._id}).exec();
    if(!userExist) {return res.status(404).send({message: 'Sever error: Could not delete account'});}
    const profileExist = await Profile.findOne({_id: user.profile}).exec();
    if(!profileExist) {return res.status(404).send({message: 'Sever error: Could not delete account'});}

    const task = Fawn.Task();
    await task.remove('profiles', {_id: userExist.profile})
    .remove('users', {_id: userExist._id})
    .run();

    res.status(200).send({message: 'Success'});
});


//get profile address
router.route('/me/address').get(auth.isAuth, async (req,res,next)=>{

    let profile = await Profile.findById(req.user.profile).exec();
    if(!profile){return res.status(404).send({message: "could not locate profile information"});}

    if(!req.query.id){
        res.status(200).send(profile.address);
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        let result = profile.address.find(element=>{
            if(element._id == id){
                return element;
            }
        });

        if(!result){
            return res.status(404).send({message: 'Invalid ID, or address no longer exist'});
        }

        res.status(200).send(result);
    }

//add profile address 1 by 1
}).post(auth.isAuth, async (req,res,next)=>{

    let {error} = Profile.validateAddress(req.body);
    if(error){return res.status(400).send({message: 'Bad request.'});}

    //check profile exist
    let profile = await Profile.findById(req.user.profile).exec();
    if(!profile){return releaseEvents.status(404).send({message:"Could not locate profile"})}

    if(req.body.main == true){//set everything else to false
        // task.update("profiles", {_id: req.user.profile}, {$set: {"address.$[].main": false}});
        await Profile.updateOne({_id: req.user.profile}, {$set: {"address.$[].main": false}}).exec();
    }

    //OPTIONAL: before adding check address length and deny add instead of slicing and auto deleting last entry
    profile = await Profile.updateOne({_id: req.user.profile}, {$push:{ address: {$each:[req.body], $position: 0, $slice: 3}}}).exec();
    // let profile = await task.run({useMongoose: true});

    if(profile.nModified <= 0){
        res.status(404).send({message: "Could not add address"});
    }else{
        res.status(200).send(profile);
    }

//edit profile address
}).put(auth.isAuth, async (req,res,next)=>{

    let {error} = Profile.validateAddress(req.body);
    if(error){
        return res.status(400).send({message: 'Bad request.'});}

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        if(req.body.main == true){//set everything else to false
            await Profile.updateOne({_id: req.user.profile}, {$set: {"address.$[].main": false}}).exec();
        }
        
        let result = await Profile.updateOne({_id: req.user.profile, "address._id": id}, {$set: {"address.$": req.body}}).exec();

        if(result.nModified <= 0){
            res.status(404).send({message: "Address not found."});
        }else{
            res.status(200).send(result);
        }
    }

//todo delete all or one at a time?
//delete profile address
}).delete(auth.isAuth, async(req,res,next)=>{

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}
        
        let result = await Profile.updateOne({_id: req.user.profile, "address._id": id}, {$pull: {address: {_id: id}}}).exec();

        if(result.nModified <= 0){
            res.status(404).send({message: "Address not found."});
        }else{
            res.status(200).send(result);
        }
    }
    
});

//return all contacts or just 1 by query param id
router.route('/me/contact').get(auth.isAuth, async (req,res,next)=>{

    let profile = await Profile.findById(req.user.profile).exec();
    if(!profile){return res.status(404).send({message: "could not locate profile information"});}

    if(!req.query.id){
        res.status(200).send(profile.contact);
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        let result = profile.contact.find(element=>{
            if(element._id == id){
                return element;
            }
        });

        if(!result){
            return res.status(404).send({message: 'Invalid ID, or contact no longer exist'});
        }

        res.status(200).send(result);
    }

//add contact 1 by 1
}).post(auth.isAuth, async (req, res, next)=>{

    //validate
    let {error} = Profile.validateContact(req.body);
    if(error){return res.status(400).send({message: 'Bad request. Invalid Contact'});}

    if(req.body.main == true){//set everything else to false if adding a main contact
        await Profile.updateOne({_id: req.user.profile}, {$set: {"contact.$[].main": false}}).exec();
    }

    //OPTIONAL: before adding check contact length and deny add instead of slicing and auto deleting last entry
    //add contact
    let profile = await Profile.updateOne({_id: req.user.profile}, {$push:{ contact: {$each:[req.body], $position: 0, $slice: 3}}}).exec();
    // let profile = await task.run({useMongoose: true});

    if(profile.nModified <= 0){
        res.status(404).send({message: "could not add"});
    }else{
        res.status(200).send(profile);
    }

//edit contact  by query param id
}).put(auth.isAuth, async (req, res,next)=>{

    let {error} = Profile.validateContact(req.body);
    if(error){
        return res.status(400).send({message: 'Bad request.'});}

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        if(req.body.main == true){//set everything else to false
            await Profile.updateOne({_id: req.user.profile}, {$set: {"contact.$[].main": false}}).exec();
        }
        
        let result = await Profile.updateOne({_id: req.user.profile, "contact._id": id}, {$set: {"contact.$": req.body}}).exec();

        if(result.nModified <= 0){
            res.status(404).send({message: "Contact not found."});
        }else{
            res.status(200).send(result);
        }
    }

//delete contact by query param id
}).delete(auth.isAuth, async (req, res, next)=>{

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}
        
        let result = await Profile.updateOne({_id: req.user.profile, "contact._id": id}, {$pull: {contact: {_id: id}}}).exec();

        if(result.nModified <= 0){
            res.status(404).send({message: "Contact not found."});
        }else{
            res.status(200).send(result);
        }
    }
});

//get all government related informations or by req query  - id
router.route('/me/gov').get(auth.isAuth, async (req,res,next)=>{

    let profile = await Profile.findById(req.user.profile).exec();
    if(!profile){return res.status(404).send({message: "could not locate profile information"});}

    if(!req.query.id){
        res.status(200).send(profile.government);
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        let result = profile.government.find(element=>{
            if(element._id == id){
                return element;
            }
        });

        if(!result){
            return res.status(404).send({message: 'Invalid ID, or information no longer exist'});
        }

        res.status(200).send(result);
    }

//add government info 1 by 1
}).post(auth.isAuth, async (req,res,next)=>{

    //validate
    let {error} = Profile.validateGov(req.body);
    if(error){return res.status(400).send({message: 'Bad request. Invalid information'});}

    //OPTIONAL: before adding check contact length and deny add instead of slicing and auto deleting last entry
    //add information
    let profile = await Profile.updateOne({_id: req.user.profile}, {$push:{ government: {$each:[req.body], $position: 0, $slice: 10}}}).exec();
    // let profile = await task.run({useMongoose: true});

    if(profile.nModified <= 0){
        res.status(404).send({message: "could not add"});
    }else{
        res.status(200).send(profile);
    }

    //delete government info by req query - id
}).put(auth.isAuth, async(req,res,next)=>{

    let {error} = Profile.validateGov(req.body);
    if(error){
        return res.status(400).send({message: 'Bad request.'});}

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        let result = await Profile.updateOne({_id: req.user.profile, "government._id": id}, {$set: {"government.$": req.body}}).exec();

        if(result.nModified <= 0){
            res.status(404).send({message: "Information not found."});
        }else{
            res.status(200).send(result);
        }
    }

    //delete government information
}).delete(auth.isAuth, async(req,res,next)=>{

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}
        
        let result = await Profile.updateOne({_id: req.user.profile, "government._id": id}, {$pull: {government: {_id: id}}}).exec();

        if(result.nModified <= 0){
            res.status(404).send({message: "Information not found."});
        }else{
            res.status(200).send(result);
        }
    }
});


//keep in mind
//1 spouse, mother, father only
//in-law, cousin, step-sibling, sibling, step-father, step-mother, child, grand-child, niece, nephew, 
//get relatives - all or by query id
router.route('/me/relatives').get(auth.isAuth, async (req,res,next)=>{

    let profile = await Profile.findById(req.user.profile).exec();
    if(!profile){return res.status(404).send({message: "could not locate profile information"});}

    if(!req.query.id){
        res.status(200).send(profile.relatives);
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        let result = profile.relatives.find(element=>{
            if(element._id == id){
                return element;
            }
        });

        if(!result){
            return res.status(404).send({message: 'Could not find the relative.'});
        }

        res.status(200).send(result);
    }

    //add relatives 1 by 1
}).post(auth.isAuth, async(req,res,next)=>{

    let {error} = Profile.validateRelative(req.body);
    if(error){return res.status(400).send({message: 'Bad request. Invalid information', error: error});}
    
    let profile = await Profile.findById(req.user.profile);
    if(!profile){return res.status(404).send({message: "could not locate profile information"});}

    //OPTIONAL: before adding check relatives length and deny add instead of slicing and auto deleting last entry
    let relativeLength = profile.relatives.length
    let relativeLimit = 10; //better if set on profile model as statics Profile.relativeLimit
    if(relativeLength >= relativeLimit){
        //deny access
        res.status(400).send({message: "maximum relatives reached"});

    }else{
        //add information
        const task = Fawn.Task();//save to database
        
        //add profile information
        let newProfile = new Profile(req.body.profile);
        task.save('profiles', newProfile);
        
        //add relative information
        let relative = {profile: newProfile._id,
            relationship: req.body.relationship}
        task.update('profiles', {_id: profile._id}, {$push:{ relatives: {$each:[relative], $position: 0, $slice: 10}}});

        //execute tasks
        task.run()
        .then(results=>{
            res.status(200).send(results);
        });
    }

//edit relatives profile information
}).put(auth.isAuth, async(req,res,next)=>{
    
    let {error} = Profile.validateRelative(req.body);
    if(error){ return res.status(400).send({message: 'Bad request.'});}

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;

        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}

        let profile = await Profile.findById(req.user.profile).exec();
        if(!profile){return res.status(404).send({message: "could not locate profile information"});}

        //find the relative
        let relative = profile.relatives.find(element=>{
            return element.profile == id;
        });

        //fawn task
        //add information
        const task = Fawn.Task();//save to database
        
        //update relative profile information
        task.update('profiles', {_id: relative.profile}, req.body.profile);
        
        //update relative relationship information
        let entry = {profile: relative.profile,
                    relationship: req.body.relationship};
        task.update('profiles', {_id: profile._id, "relatives.profile": relative.profile}, {$set:{ "relatives.$": entry}});

        //execute tasks
        task.run()
        .then(results=>{
            res.status(200).send(results);
        });
    }

//delete relative via query id
}).delete(auth.isAuth, async(req,res,next)=>{

    if(!req.query.id){
        res.status(400).send({message: "Bad request."});
    }else{
        let id = req.query.id;
        
        let {error} = Profile.validateId({id: id});
        if(error){return res.status(400).send(error);}
        
        //find personal profile
        let profile = await Profile.findById(req.user.profile).exec();
        if(!profile){return res.status(404).send({message: "could not locate profile information"});}
        
        //find the relative within personal profile
        let profileRelative = profile.relatives.find(element=>{
            return element.profile == id;
        });
        if(!profileRelative){return res.status(404).send({message:"could not locate relative from profile"});}
        
        //find relative profile information
        let relative = await Profile.findById(id).exec();
        if(!relative){return res.status(404).send({message: "could not locate relative information"});}
        
        
        //fawn task
        //add information
        const task = Fawn.Task();//save to database
        
        //check that profile has NO account before deleting profile
        let relativeAccount = await User.findOne({profile: relative._id}).exec();
        //remove relative profile information without account
        if(!relativeAccount){ task.remove('profiles', {_id: relative._id});}

        //update - pull relative from relationship information
        task.update('profiles', {_id: profile._id, "relatives.profile": relative._id}, {$pull: {relatives: {profile: relative._id}}});

        //execute tasks
        task.run()
        .then(results=>{
            res.status(200).send(results);
        });
    }
});

module.exports = router;