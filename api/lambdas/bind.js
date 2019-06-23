const express = require('express');
const bodyParser = require('body-parser')
const bindRouter = require('../routes/bind');

const app = express();

app.use(bodyParser.json())
app.use(bindRouter);

module.exports = app;