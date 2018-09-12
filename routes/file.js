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
//validator
const   Joi         = require('joi');
        Joi.objectId = require('joi-objectid')(Joi);
//file handler
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //create picture path using profile id
        let path = config.get('imgDestination') + req.user.profile;

        //check if directory already exist
        fs.access(path, (err)=>{
            if(!err){
                //set dir
                cb(null, path)
            }else{

                //create the directory
                fs.mkdir(path, (err)=>{
                    if(!err){
                        //set dir
                        cb(null, path);
                    }else{
                        winston.info({message: "Could not create directory", error: err});
                    }
                });
            }
        });
    },
    filename: function(req, file, cb){
        //add file extention and rename as profile id
        let extention = path.parse(file.originalname).ext;
        let name = file.fieldname + extention;

        //save filename as profile id
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


                //TODO: delete pictures on company, profile, and user routes when deleting accounts
//todo: save to profile the file directory
//todo - learn multiple upload
//TODO: setting of profile pic
//upload picture 1 by 1
router.route('/photo').post(auth.isAuth, upload.single('imgField'), (req,res,next)=>{
    
    //validate
    let {error} = Joi.validate(req.body.imageName, Joi.string().regex(regex.commonAlphaNum).required());
    if(error){return res.status(400).send({message: "Bad request."})}

    //get file extention
    let extention = path.parse(req.file.originalname).ext;
    let newPath =  req.file.destination + "/" + req.body.imageName + extention;

    //rename file
    fs.rename(req.file.path, newPath, async (err)=>{
        if(!err){
            
            //establish details
            let pic = {filename: req.body.imageName + extention,
                path: newPath,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                size: req.file.size}
            //save to database profile pics array
            let profile = await Profile.updateOne({_id: req.user.profile}, {$push: {pics: pic}}).exec();
                
            res.status(200).send({message:"success"});
        }else{
            //try again or delete?
            console.log(err);
        }
    });

//delete profile picture using profile id
}).delete(auth.isAuth, (req,res,next)=>{

    //check that there is a req.query
    if(!req.query.name){ return res.status(400).send({message: "Bad request"});}

    //validate
    let {error} = Joi.validate(req.query.name, Joi.string().regex(regex.imgName).required());
    if(error){return res.status(400).send({message: "Bad request."})}

    //set file to delete
    let fileToDelete = req.query.name;
    //establish path destination
    let pathToFile = config.get('imgDestination') + req.user.profile;

    //open image destination directory
    fs.readdir(pathToFile, (err, files)=>{

        //TODO: remove extention to make it more flexible  and case insensitive (.jpg .JPG)
        //find the file within the directory
        let file = files.find(el=>{
            return path.parse(el).name == path.parse(fileToDelete).name;
        });

        //establish new path to delete
        pathToFile = pathToFile + "/" + file;

        //delete file
        fs.unlink(pathToFile, async (err)=>{
            if(!err){
                //remove from database profile pics array
                let profile = await Profile.updateOne({_id: req.user.profile}, {$pull: {pics: {filename: file}}}).exec();

                return res.status(200).send({message:"Success."});
            }else{
                return res.status(400).send({message:"Delete failed", error:err})
            }
        });
    });

}).get(auth.isAuth, (req,res,next)=>{
    //establish file path
    let pathToFile = config.get('imgDestination') + req.user.profile;
    //check that there is a req.query
    if(req.query.name){
        
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
});



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