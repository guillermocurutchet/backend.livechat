require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const app = express();
const port = process.env.PORT || 3000;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

app.use(bodyParser.json());

app.post('/message', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  pusher.trigger('my-channel', 'my-event', { message })
    .then(() => res.status(200).send('Message sent to Pusher'))
    .catch(err => {
      console.error('Error sending message to Pusher:', err);
      res.status(500).send('Error sending message to Pusher');
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
