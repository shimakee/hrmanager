//  environment variable setup
require('dotenv').config();//required to run .env variables
//server
const express = require('express');
const app = express();
//error handling package
const winston = require('winston');


require('./startup/log')();//logging
require('./startup/db')();//database
require('./startup/config')();//config
require('./startup/routes')(app);//routes & middleware use
require('./startup/utilities')();//tools & utilities like validation

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{//running server
        winston.info(`listening on port ${PORT}...`);
});