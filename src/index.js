'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const XRay = require('aws-xray-sdk');

// XRay Configs
XRay.config([XRay.plugins.EC2Plugin]);

// Constants
const PORT = process.env.PORT || 8080;

// App
const app = express();

// Instrument get call
app.use(XRay.express.openSegment('getCall'));
app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  let data = {
    message: 'Data received from API'
  };
  res.send(JSON.stringify(data, null, 2));
});
app.use(XRay.express.closeSegment());

app.listen(PORT);
console.log(`Running on http://${PORT}`);
