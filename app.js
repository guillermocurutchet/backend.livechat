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
  const { message, from } = req.body;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  // Enviar el mensaje a Pusher
  pusher.trigger('my-channel', 'my-event', { message, from })
    .then(() => res.status(200).send('Message sent to Pusher'))
    .catch(err => {
      console.error('Error sending message to Pusher:', err);
      res.status(500).send('Error sending message to Pusher');
    });
});

// Ruta para recibir respuestas desde Teams
app.post('/receive-from-teams', (req, res) => {
  const messageFromTeams = req.body.text;
  const sender = req.body.from;
  console.log('Message received from Teams:', messageFromTeams, 'From:', sender);

  pusher.trigger('my-channel', 'my-event', {
    message: messageFromTeams,
    from: sender,
    time: new Date().toLocaleTimeString()
  })
    .then(() => res.status(200).send('Message received from Teams and sent to Pusher'))
    .catch(err => {
      console.error('Error sending message to Pusher:', err);
      res.status(500).send('Error sending message to Pusher');
    });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
