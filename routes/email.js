'use strict';
const nodemailer = require('nodemailer');
const   express = require('express'),
        router = express.Router({mergeParams: true});
const auth = require('../middleware/auth');
const config = require('config');
const tools = require('../util/tools');
const winston = require('winston');



router.route('/send').post(auth.isAuth, (req,res,next)=>{
    let mailConfig;

    if(config.util.getEnv('NODE_ENV') === "production"){
        mailConfig = {//real host
            host: config.get('emailHost'),//set on node ENV variable
            port: 587,
            secure: false,
            auth: {
                user: config.get('emailUser'), // set on node ENV variable
                pass: config.get('emailPass') // set on node ENV variable
            }
        }
        
    }else{
        mailConfig = {//test host
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports //using ssl
            auth: {
                user: 'gpdj2t24zfcmjw26@ethereal.email',
                pass: 'CJ89mqGy88Qh4mgrca'
            },
            tls:{
                rejectUnauthorized: false
            }
        }

        // setup email data with unicode symbols
        // mailOption = {
        //     from: '"PC Master race 👻" <MaStEr@what.com>', // sender address
        //     to: 'bar@example.com', // list of receivers
        //     subject: 'Hello ✔', // Subject line
        //     text: 'Hello world?', // plain text body
        //     html: '<b>Hello world?</b><br><h1>Yes!</h1>' // html body
        // };
    }

    //validate request
    let result = tools.validate.mailOption(req.body.mailOption);
    if(result.error){ return res.status(400).send({message:'Bad request'});}

    let mailOption = req.body.mailOption;

    let transporter = nodemailer.createTransport(mailConfig);
    
    // send mail with defined transport object
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            winston.debug(error);
            return res.status(500).send({message:"Could not sent email"});
        }

        winston.info('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        winston.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.status(200).send(info);
    });
});

module.exports = router;