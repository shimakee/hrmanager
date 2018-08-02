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

router.route('/me').get(auth.isAuth, async (req,res,next)=>{
    const user = req.user;
        let  profile = await Profile.findOne({_id: user.profile}).exec();
        if(!profile){return res.status(400).send({message: 'Bad request.'});}//remove error handling because of wrapper?
        
        profile = _.omit(profile.toObject(), ['alive', '_id']);//remove important properties
        res.status(200).send(profile);

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

router.route('/me/address').get(auth.isAuth, async (req,res,next)=>{

    let profile = await Profile.findById(req.user.profile).exec();

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

}).post(auth.isAuth, async (req,res,next)=>{

    let {error} = Profile.validateAddress(req.body);
    
    if(error){return res.status(400).send({message: 'Bad request.'});}

    // let task = Fawn.Task(); //DO not use Fawn task removes object id;

    if(req.body.main == true){//set everything else to false
        // task.update("profiles", {_id: req.user.profile}, {$set: {"address.$[].main": false}});
        await Profile.updateOne({_id: req.user.profile}, {$set: {"address.$[].main": false}}).exec();
    }

    // task.update("profiles", {_id: req.user.profile}, {$push:{ address: {$each:[req.body], $position: 0, $slice: 3}}});
    let profile = await Profile.updateOne({_id: req.user.profile}, {$push:{ address: {$each:[req.body], $position: 0, $slice: 3}}}).exec();
    // let profile = await task.run({useMongoose: true});

    res.status(200).send(profile);

}).put(auth.isAuth, async (req,res,next)=>{

    let {error} = Profile.validateAddress(req.body);
    if(error){
        console.log(error);
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

        res.status(200).send(result);
    }

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
    
});//todo delete all or one at a time

router.route('/me/contacts').get((req,res,next)=>{

});

router.route('/me/government').get((req,res,next)=>{

});

router.route('/me/relatives').get((req,res,next)=>{

});

module.exports = router;