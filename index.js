require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const messageHandler = require('./netlify/functions/message');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/netlify/functions/message', (req, res, next) => {
    console.log('Received request:', req.body);
    next();
}, (req, res) => {
    console.log('Request reached handler');
    messageHandler.handler(req, res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
