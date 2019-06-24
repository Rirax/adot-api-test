const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bindRouter = require('../routes/bind');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bindRouter);

module.exports = app;
