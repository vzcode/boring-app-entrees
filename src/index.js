'use strict';
const express = require('express');
// const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
const PORT = process.env.PORT || 8080;

app.use('/', routes);
app.use('/entrees', routes);

app.listen(PORT);
console.log(`Running on http://${PORT}`);


module.exports = {
  app
}