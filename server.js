require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./app/src/config/mongodb');
const createError = require('http-errors');
const errorHandler = require('./app/src/api/v1/http/middlewares/errorHandler');


const PORT = process.env.PORT || 5500;
const url = process.env.DB_CONNECTION_STRING;


// use extension morgan
app.use(morgan());


//connect database
connectDB(url);


//handle cors error
app.use(cors());


//middleware get info from client by req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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