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
        let  profile = await Profile.findOne({_id: user.profile});
        if(!profile){return res.status(400).send('Bad request.');}//remove error handling because of wrapper?
        
        profile = _.omit(profile.toObject(), ['alive', '_id']);//remove important properties
        res.status(200).send(profile);

}).put(auth.isAuth, async (req,res,next)=>{
    const user = req.user;
    let data = req.body;

    let {error} = Profile.validate(data);
    if(error){return  res.status(400).send(error);} //TODO remove because of wrapper

    
    const profile = await Profile.findOne({_id: user.profile});//find profile if existing
    if(!profile){return res.status(400).send("Bad request.")}

        data = _.omit(data, ['_id']); //prevent id change
        await Profile.updateOne({_id: user.profile}, data);
        res.status(200).send('Success');

}).delete(auth.isAuth, async (req,res,next)=>{
    let user = req.user;

    const userExist = await User.findOne({_id: user._id});
    if(!userExist) {return res.status(404).send('Sever error: Could not delete account');}

        const task = new Fawn.Task();
        task.remove('profiles', {_id: user.profile})
        .remove('users', {_id: user._id})
        .run();

        return res.status(200).send('Success');
});

module.exports = router;