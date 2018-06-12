const mongoose = require('mongoose');
const   URI         =       process.env.URI;
//utilities
const winston = require('winston');
const Fawn = require('fawn');


module.exports = function(){
    mongoose.connect(URI)
        .then(()=>{winston.info('Connected to database...')});

    Fawn.init(mongoose); //enable transaction
}