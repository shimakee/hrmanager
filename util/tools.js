const Joi = require('joi');
        Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');

//TODO: date tool using npm to generate clients local date or servers date - use moment npm package
tools={
    get:{
        objectId(data = null){
            if(data){
                return new mongoose.mongo.ObjectId(data);
            }else{
                return new mongoose.mongo.ObjectId();
            }
        }
    },
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
        },
        isObjectId(data){
            
            let {error} =  Joi.validate(String(data), Joi.objectId().required());

            if(!error){
                return true
            }else{
                
                return false
            }
        },
        address(data){

            const addressSchema = Joi.object().keys({
                _id: Joi.objectId().allow(''),
                main:Joi.boolean().default(false),
                description:Joi.string().max(50).regex(regex.common).allow(''),
                street:Joi.string().max(255).regex(regex.address).allow(''),
                city:Joi.string().max(50).regex(regex.common).allow(''),
                country:Joi.string().max(50).regex(regex.common).allow(''),
                province: Joi.string().max(100).regex(regex.common).allow(''),
                zipcode:Joi.number().positive().integer().min(1000).max(9999).allow(''),
                position:{
                    lat: Joi.number().max(85).min(-85).allow(''),
                    lng: Joi.number().max(180).min(-180).allow('')
                }
            });
            
            //TODO: set max limit as variable somewhere in config, or model
            const arraySchema = Joi.object().keys({
                address: Joi.array().max(3).unique('street').items(addressSchema.required()).single().required()
            });
        
            return arraySchema.validate(data);
        },
        contact(data){
    
            const contactSchema = Joi.object().keys({ //to be tested
                main: Joi.boolean().allow(''),
                description:Joi.string().max(25).regex(regex.common),
                countryCode:Joi.number().integer().positive().max(999999).allow(''),
                areaCode:Joi.number().integer().positive().max(999999).allow(''),
                number:Joi.number().integer().positive().max(999999999999999)
            });

            //TODO: set max limit as variable somewhere in config, or model
            const arraySchema = Joi.object().keys({
                contact: Joi.array().max(3).unique('number').items(contactSchema.required()).single().required()
            });
        
            return arraySchema.validate(data);
        },
        government(data){
    
            const governmentSchema = Joi.object().keys({//to be tested
                key:Joi.string().max(100).regex(regex.common),
                info:Joi.string().max(100).regex(regex.commonAlphaNum)
            });

            //TODO: set max limit as variable somewhere in config, or model
            const arraySchema = Joi.object().keys({
                government: Joi.array().max(3).unique('key').items(governmentSchema.required()).single().required()
            });
        
            return arraySchema.validate(data);
        },
        email(data){
            const emailSchema = Joi.object().keys({//to be tested
                main:Joi.boolean().allow('').default(false),
                address:Joi.string().email().required()
            });
        
            //TODO: set max limit as variable somewhere in config, or model
            const arraySchema = Joi.object().keys({
                address: Joi.array().max(3).unique('address').items(emailSchema.required()).single().required()
            });
        
            return arraySchema.validate(data);
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
                        host: 'smtp.gmail.com',//set on node ENV variable
                        port: 465,
                        secure: true,
                        auth: {
                            user: config.get('emailUser'), // set on node ENV variable
                            pass: config.get('emailPass') // set on node ENV variable
                        },
                        tls:{
                            rejectUnauthorized: false
                        }
                    }
                    
                }else{
                    mailConfig = {//test host
                        host: 'smtp.ethereal.email',
                        // host: 'smtp.gmail.com',
                        port: 587,
                        // port: 465,
                        secure: true, // true for 465, false for other ports //using ssl
                        auth: {
                            user: 'rgfx3mif3woansd3@ethereal.email',
                            pass: 'gRTuAJu25fqEUGYRgv'
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