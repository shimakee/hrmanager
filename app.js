//  environment variable setup
require('dotenv').config();//required to run .env variables
const   env         =       process.env,
        PORT        =       env.PORT || 8080;

const   express     =       require('express'),
        app         =       express();

        app.use(express.static(__dirname));//using directory to serve static index file for vue

        app.listen(PORT, ()=>{//running server
            console.log(`listening on port ${PORT}`);
        });