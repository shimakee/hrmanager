const express = require('express');
//requiring routes
const userRoutes = require('../routes/user');
const profileRoutes = require('../routes/profile');
const fileRoutes = require('../routes/file');
const companyRoutes = require('../routes/company');
const businessRoutes = require('../routes/business');
const employmentRoutes = require('../routes/employee');
//error hander
const errorHandler = require('../middleware/err');

module.exports = function(app){
    app.use(express.json());//using body parser

    app.use('/user', userRoutes);//using routes
    app.use('/profile', profileRoutes);//profile routes
    app.use('/file', fileRoutes); //file routes
    app.use('/company', companyRoutes);//company routes
    app.use('/business', businessRoutes);//business routes
    app.use('/employment', employmentRoutes);//employee routes

    app.use(errorHandler);//handling errors within express
}