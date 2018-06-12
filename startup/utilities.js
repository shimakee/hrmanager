const   Joi         =       require('joi');//validators

module.exports = function(){
    Joi.objectId = require('joi-objectid')(Joi);//initialize to allow objectID validation
}