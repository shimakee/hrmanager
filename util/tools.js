const Joi = require('joi');
const config = require('config');

tools={
    validate:{
        mailOption(data){
            let mailOptionSchema = Joi.object().keys({
                        from: Joi.string().max(255).required(), // sender address
                        to: Joi.string().email().max(255).required(), // list of receivers
                        subject: Joi.string().max(255).required(), // Subject line
                        text: Joi.string().max(1022), // plain text body
                        html: Joi.string().max(2044)
            });

        
            return mailOptionSchema.validate(data, {presence:'optional', stripUnknown: true});
        }



    },
    email:{
        send(data){
            return new Promise((resolve, reject)=>{
                'use strict';
                const nodemailer = require('nodemailer');

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
                }

                //validate request
                let {error} = tools.validate.mailOption(data);
                if(error){reject(error)}

                let mailOption = data;
                let transporter = nodemailer.createTransport(mailConfig);
                
                // send mail with defined transport object
                transporter.sendMail(mailOption)
                    .then(info=>{

                        resolve(info);
                    }).catch(err=>{

                        reject(err);
                    });
            });
        }
    }

}

module.exports = tools;