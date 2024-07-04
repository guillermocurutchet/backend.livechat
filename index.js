const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

// Configuración del servidor Pusher
const pusher = new Pusher({
  appId: '1828780',
  key: '89c6234d11a20345a8fd',
  secret: '51591d5970e39ba6b563',
  cluster: 'us2',
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
