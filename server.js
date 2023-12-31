require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');
const createError = require('http-errors');
const errorHandler = require('./app/src/api/v1/http/middlewares/errorHandler');
const connectDB = require('./app/src/config/mongodb');
const cookieParser = require('cookie-parser');



const PORT = process.env.PORT || 5500;
const url = process.env.DB_CONNECTION_STRING;


// use extension morgan
// app.use(morgan());


//connect database
connectDB(url);


//handle cors error
app.use(cors());


//cookies
app.use(cookieParser());


//middleware get info from client by req.body
app.use(express.static('./app/src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//method override
app.use(methodOverride('_method'));


// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, './app/src/resources/views'));
app.set('layout', 'layout');
app.set('layoutError', './app/src/resources/views/errors/error');
app.set('layoutAdmin', './app/src/resources/views/admin/adminLayout');
app.set('layoutMember', './app/src/resources/views/member/memberLayout');
app.set('view engine', 'ejs')


//route
require('./app/src/api/v1/routes/web')(app);


// Middleware error handling
app.use((req, res, next) =>{
    next(createError.NotFound);
});
app.use(errorHandler);


//check server start
const server = app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
})