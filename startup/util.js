const cookieParser = require('cookie-parser');
// const cors = require('cors');
const cors = require('../middleware/auth').cors;
const config = require('config');

module.exports = function(app){
    //cookieparser
    app.use(cookieParser(config.get('cookieSecret')));
    //allow cors
    app.use(cors);
}