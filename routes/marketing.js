const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
const config = require('config');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const regex = require("../util/regex");
//request to another server - cors
// const cors = require('cors');
const http = require('http');
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

        //save profile id as filename
        cb(null, name);
    }
});
const fileFilter = (req, file, cb)=>{
    console.trace('filter', file);
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
router.route('/textblast').post(auth.isAuth, (req,res,next)=>{
    
    const data = JSON.stringify(req.body); //stringify the data

    const options = { //create options
        host: '192.168.254.123',
        path:'/goip_post_sms.html?username=shimakee&password=riffraff',
        port: '80',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
          }
    }

    let reqSend = http.request(options, (response)=>{
        // console.trace(response);
        let resStr = '';


        response.on('data', function(chunk){
            // console.trace('chunk', chunk);
            resStr += chunk;
        })

        response.on('end', function(){
            // console.trace(resStr);
            // console.log('reqbody', req.body);
            res.status(200).send({req: req.body, res: JSON.parse(resStr)});
        })
    });
    
    reqSend.on('error', (err)=>{
        console.log('something went wrong');
    });

    reqSend.write(data);
    reqSend.end();
});



module.exports = router;