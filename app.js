//  environment variable setup
require('dotenv').config();//required to run .env variables
const   env         =       process.env,
        PORT        =       env.PORT || 8080;

//application serverside dependency setup
const   express     =       require('express'),
        app         =       express();

        
//requiring routes
const noAuthRoutes = require('./routes/noAuthRoutes');

app.use(express.static(__dirname));//using directory to serve static index file for vue
app.use('/', noAuthRoutes);

app.listen(PORT, ()=>{//running server
        console.log(`listening on port ${PORT}`);
});