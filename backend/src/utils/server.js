const express = require('express');
const cors = require('cors');
const routes = require('../routes/v1');
const morgan = require('../config/morgan');


const createServer = () => {
    const app = express();
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);

    // parse json request body
    app.use(express.json());

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }));
    const fileUpload = require('express-fileupload')
    app.use(fileUpload({
      useTempFiles:true
    }))
    
     // enable cors
    app.use(cors());
    app.options('*', cors());

    // v1 api routes
    app.use('/v1', routes);

    return app;
}

module.exports = createServer