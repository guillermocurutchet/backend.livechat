require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messageHandler = require('./netlify/functions/message');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/.netlify/functions/message', messageHandler.handler);
app.post('/.netlify/functions/response-handler', messageHandler.responseHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
