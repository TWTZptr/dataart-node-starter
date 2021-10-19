const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./utils/errors/errorHandler');
const responseInterceptor = require('./interceptors/response');
const requestLogger = require('./utils/requestLogger');
const resourceModule = require('./modules/resource');
const userModule = require('./modules/user');

const { APP } = require('./config');
const { error404Handler } = require('./utils/errors');

//initialize the app
const app = (module.exports = express());

app.use(cors());
app.use(responseInterceptor);

app.use(requestLogger);
app.use(bodyParser.json({ limit: APP.JSON_REQUEST_LIMIT }));
app.use(bodyParser.raw({ limit: APP.RAW_REQUEST_LIMIT }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/resources', resourceModule);
app.use('/api/users', userModule);

//in case any route mismatches request url - send 404 statusCode
app.use(error404Handler);
//re-format all errors to accepted json structure
app.use(errorHandler);
