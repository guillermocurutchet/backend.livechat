require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

// Configuración del servidor Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint para recibir mensajes de Teams
app.post('/receive-from-teams', (req, res) => {
  const messageFromTeams = req.body.text;
  const sender = req.body.from;
  console.log('Message received from Teams:', messageFromTeams, 'From:', sender);

  // Enviar mensaje a Pusher
  pusher.trigger('my-channel', 'my-event', {
    text: messageFromTeams,
    from: sender,
    time: new Date().toLocaleTimeString()
  });

  res.status(200).send('Message received from Teams and sent to Pusher');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});