const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(require('./user'));
app.use(require('./login'));
app.use(require('./profile'));
app.use(require('./course'));
app.use(require('./module'));
app.use(require('./transaction'));


module.exports = app;