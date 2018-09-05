const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
const config = require('config');
const fs = require('fs');
const path = require('path');
//file handler
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){

        //set save file destination in config
        cb(null, config.get('imgDestination'))
    },
    filename: function(req, file, cb){

        //add file extention and rename as profile id
        let nameSplit = file.originalname.split('.')
        if(nameSplit.length === 2){
            //save filename as profile id
            cb(null, req.user.profile + '.'+ nameSplit[1]);
        }
        // else{
            //either return an error, or 
            //check mime type and add manually
            // cb(null, file.originalname)
        // }
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


//upload profile picture
router.route('/photo').post(auth.isAuth, upload.single('imgFile'), (req,res,next)=>{

   res.status(200).send({message:"success"});

//delete profile picture using profile id
}).delete(auth.isAuth, async (req,res,next)=>{

    let path = config.get('imgDestination');

    //open image destination directory
    fs.readdir(path, (err, files)=>{

        //find the file within the directory
        let file = files.find(el=>{
            //remove extention
            let element = el.split('.');
            return element[0] == req.user.profile;
        });

        //establish path +filename
        path = path + file;
        //delete
        fs.unlink(path, (err)=>{
            if(err){
                return res.status(400).send({message:"Delete failed"})
            }else{
                return res.status(200).send({message:"Success."});
            }
        });
    });

});



module.exports = router;