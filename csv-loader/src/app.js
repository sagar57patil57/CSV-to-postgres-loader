require('dotenv').config();
const express = require('express');
const app = express();
const csvController = require('./controllers/csvController');

app.use(express.json());

// route tp process csv file
app.post('/process-csv', csvController.processCsv);

module.exports = app;
