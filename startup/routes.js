const express = require('express');
//requiring routes
const userRoutes = require('../routes/user');
const profileRoutes = require('../routes/profile');
//error hander
const errorHandler = require('../middleware/err');

module.exports = function(app){
    app.use(express.json());//using body parser

    app.use('/user', userRoutes);//using routes
    app.use('/profile', profileRoutes);//profile routes

    app.use(errorHandler);//handling errors within express
}