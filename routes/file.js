const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
const config = require('config');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const regex = require("../util/regex");
//model
const Profile = require("../models/profile");
const Company = require("../models/company");
const User = require("../models/user");
//validator
const   Joi         = require('joi');
        Joi.objectId = require('joi-objectid')(Joi);
const   isObjectId = require('../util/tools').validate.isObjectId;
//file handler
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //create picture path using account type and profile id
        let destination;
        if(req.user.accountType == 'profile'){
            destination = config.get('imgDestination') + `/${req.user.accountType}/${req.user.profile}`;
        }else if(req.user.accountType == 'company'){
            destination = config.get('imgDestination') + `/${req.user.accountType}/${req.user.company}`;
        }
        let destinationArray = destination.split(/[\\\/]{1,2}/);
        let pathConcat = '';

        //check if file and full directory already exist
        fs.access(destination, (err)=>{
            if(!err){//already exist - set dir
                cb(null, destination)
            }else{

                //recursively create directory
                for (let i = 0; i < destinationArray.length; i++) {
                    let element = destinationArray[i];
                    
                    if(i != 0){//only add slash if its not the first directory
                        element = `/${element}`;
                    }

                    pathConcat += `${element}`;//concatinate every pass on path

                    fs.mkdir(pathConcat, (err)=>{//create directory
                        if(err){
                            winston.info({message: `Could not create directory:${pathConcat}`, error: err});
                        }else{
                            if(pathConcat == destination){//check that created directory matches full directory
                                cb(null, pathConcat); //pass match as destination
                            }
                        }
                    });
                }
            }
        });
    },
    filename: function(req, file, cb){
        //add file extention and rename as profile id
        let extention = path.parse(file.originalname).ext;
        let name = file.fieldname + extention;

        //save profile id as filename
        cb(null, name);
    }
});
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
        cb(null, true);
    }else{
        cb(null, false)
    }
}
const upload = multer({storage: storage,
                limits:{
                    fileSize: 1024 * 1024 * 3, //accept 3MB as limit
                    fields: 30
                },
                fileFilter: fileFilter});


//upload picture 1 by 1
router.route('/photo/me').post(auth.isAuth, upload.single('imgField'), (req,res,next)=>{
    
    //validate
    if(!req.body.imgName){return res.status(400).send({message: "Bad request. imgName required"});}
    let {error} = Joi.validate(req.body.imgName, Joi.string().regex(regex.commonAlphaNum).required());
    if(error){return res.status(400).send({message: "Bad request. Invalid characters"})}



    //get file extention
    let extention = path.parse(req.file.originalname).ext;
    let newPath =  req.file.destination + "/" + req.body.imgName + extention;

    //rename file
    fs.rename(req.file.path, newPath, async (err)=>{
        if(!err){
            const accountType = req.user.accountType;
            
            //establish details
            let pic = {main: true,
                filename: req.body.imgName + extention,
                path: newPath,
                destination: req.file.destination,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                size: req.file.size}

            //TODO: depending on account type
            if(accountType == "profile"){
                const oldProfile = await Profile.findById(req.user.profile).exec();
                if(!oldProfile){return res.status(404).send({message:'could not locate profile to upload.'});}

                let result = oldProfile.pics.find(element=>{
                    if(element.path == pic.path){
                        return element;
                    }
                });

                if(!result){//if it doesnt exist
                    //set everything else to false
                    if(pic.main == true || pic.main == "true"){
                        await Profile.updateOne({_id: req.user.profile}, {$set: {"pics.$[].main": false}}).exec();
                    }
        
                    //save to database profile pics array
                    await Profile.updateOne({_id: req.user.profile}, {$push: {pics: pic}}).exec();
                }

                    
                res.status(200).send({message:"success"});
            }

            if(accountType == "company"){
                const oldCompany = await Company.findById(req.user.company).exec();
                if(!oldCompany){return res.status(404).send({message:'could not locate profile to upload.'});}

                let result = oldCompany.pics.find(element=>{
                    if(element.path == pic.path){
                        return element;
                    }
                });

                if(!result){//if it doesnt exist
                    //set everything else to false
                    if(pic.main == true || pic.main == "true"){
                        await Company.updateOne({_id: req.user.company}, {$set: {"pics.$[].main": false}}).exec();
                    }
        
                    //save to database company pics array
                    await Company.updateOne({_id: req.user.company}, {$push: {pics: pic}}).exec();
                }

                    
                res.status(200).send({message:"success"});
            }

            
        }else{
            //try again or delete?
            console.log(err);
        }
    });

//delete profile picture using profile id
}).delete(auth.isAuth, (req,res,next)=>{
    let queryImgName = req.query.name;
    let pathToFile;

    //check that there is a req.query
    if(!queryImgName){return res.status(400).send({message: "Bad request. No parameters or body to delete."});}

    //validate - either have it in body or in params
    let {error} = Joi.validate(queryImgName, Joi.string().regex(regex.imgName).required());
    if(error){return res.status(400).send({message: "Bad request. Invalid parameters or body."})}

    //set file to delete
    let fileToDelete = queryImgName || bodyImgName;
    //establish path destination
    // let pathToFile = config.get('imgDestination') + req.user.profile;
    
    if(req.user.accountType == 'profile'){
        pathToFile = config.get('imgDestination') +'/'+ req.user.accountType +'/'+req.user.profile;
    }else if(req.user.accountType == 'company'){
        pathToFile = config.get('imgDestination') +'/'+ req.user.accountType +'/'+req.user.company;
    }

    //open image destination directory
    fs.readdir(pathToFile, (err, files)=>{

        //find the file within the directory
        let file = files.find(el=>{
            return path.parse(el).name == path.parse(fileToDelete).name;
        });

        //establish new path to delete
        pathToFile = pathToFile + "/" + file;

        //delete file
        fs.unlink(pathToFile, async (err)=>{
            if(!err){//img delete sucess
                //remove corresponding data from database profile pics array
                if(req.user.accountType == "profile"){
                    await Profile.updateOne({_id: req.user.profile}, {$pull: {pics: {filename: file}}}).exec();
                }
                if(req.user.accountType == "company"){
                    await Company.updateOne({_id: req.user.company}, {$pull: {pics: {filename: file}}}).exec();
                }

                return res.status(200).send({message:"Success."});
            }else{
                return res.status(400).send({message:"Delete failed", error:err})
            }
        });
    });

}).get(auth.isAuth, (req,res,next)=>{
    //check that there is a req.query
    if(req.query.name){

        //establish file path
        let pathToFile;
        if(req.user.accountType == 'profile'){
            pathToFile = config.get('imgDestination') +'/'+ req.user.accountType +'/'+req.user.profile;
        }else if(req.user.accountType == 'company'){
            pathToFile = config.get('imgDestination') +'/'+ req.user.accountType +'/'+req.user.company;
        }
        
        //validate format of query
        let {error} = Joi.validate(req.query.name, Joi.string().regex(regex.imgName).required());
        if(!error){

            let fileToGet = req.query.name;
        
            
            pathToFile = path.resolve(pathToFile + "/"+ fileToGet);

            //fs.access file first to check if it exist
            fs.access(pathToFile, (err)=>{
                if(!err){
                    res.status(200).sendFile(pathToFile);
                }else{
                    console.log(err);
                    //or winston
                    res.status(500).send({message: "Internal server error, file may not exist"});
                }
            });
        
        }else{
            res.status(400).send({message: "Bad request."})
        }

    }else{
        res.status(400).send({message: "Bad request."});
    }
}).put(auth.isAuth, async (req,res,next)=>{
    let queryId = req.query.id;
    let result;

    //check that there is a req.query
    if(!queryId && isObjectId(queryId)){return res.status(400).send({message: "Bad request. No parameters or Invalid query id"});}

    //validate
    // let {error} = Joi.validate(queryId, Joi.string().regex(regex.imgName).required());
    // if(error){return res.status(400).send({message: "Bad request. Invalid parameters or body."})}

    // if(req.body.main == true || req.body.main == "true"){//set everything else to false
        if(req.user.accountType == 'profile'){
            await Profile.updateOne({_id: req.user.profile}, {$set: {"pics.$[].main": false}}).exec();
            result = await Profile.updateOne({_id: req.user.profile, "pics._id": queryId}, {$set: {"pics.$.main": true}}).exec();//set one as main
        }
        if(req.user.accountType == 'company'){
            await Company.updateOne({_id: req.user.company}, {$set: {"pics.$[].main": false}}).exec();
            result = await Company.updateOne({_id: req.user.company, "pics._id": queryId}, {$set: {"pics.$.main": true}}).exec();//set one as main
        }
    // }
    

    if(result.nModified <= 0){
        res.status(404).send({message: "Pics not found."});
    }else{
        res.status(200).send(result);
    }
});

//TODO - get url path of all pic in pics
//TODO: choose and set profile pic
//TODO: auto crop and check size when uploading pic



module.exports = router;

// function validateRelative(data){
//     const relativeSchema = Joi.object().keys({//to be tested
//         profile:Joi.object().keys({
//             name:{
//                 first:Joi.string().max(50).regex(regex.common).required(),
//                 middle:Joi.string().max(50).regex(regex.common).allow(''),
//                 maiden:Joi.string().max(50).regex(regex.common).allow(''),
//                 last:Joi.string().max(50).regex(regex.common).required(),
//                 suffix: Joi.string().max(50).regex(regex.common).allow('')
//             },
//             gender:Joi.string().valid(validDataLib.gender).insensitive().required(),
//             birthdate:Joi.date().min('1-1-1900').max('now').allow(''),
//             nationality:Joi.string().max(30).regex(regex.common).allow(''),
//             civilStatus:Joi.string().valid(validDataLib.civilStatus).insensitive().allow('')
//         }),
//         relationship:Joi.string().max(100).regex(regex.common)
//     });

//     return relativeSchema.validate(data, {presence:'optional'});
// }