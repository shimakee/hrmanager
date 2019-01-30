const cookieParser = require('cookie-parser');
// const cors = require('cors');
const cors = require('../middleware/auth').cors;
const config = require('config');
//validators
const   Joi         =       require('joi');//validators

module.exports = function(app, express){
    //using body parser
    app.use(express.json());
    // app.use(express.urlencoded({ extended: false })); //dont know what this one does yet
    //cookieparser
    app.use(cookieParser(config.get('cookieSecret')));
    //allow cors
    app.use(cors);

    //validators
    Joi.objectId = require('joi-objectid')(Joi);//initialize to allow objectID validation
}