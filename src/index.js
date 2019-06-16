'use strict';
const express = require('express');
// const cors = require('cors');
const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk'));
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(AWSXray.express.openSegment('Entree Service'));
app.use('/', routes);
app.use(AWSXray.express.closeSegment());

app.listen(PORT);
console.log(`Running on http://${PORT}`);


module.exports = {
  app
}