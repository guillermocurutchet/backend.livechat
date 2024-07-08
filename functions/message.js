const fetch = require('node-fetch');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

exports.handler = async function(event, context) {
  try {
    const { message, from } = JSON.parse(event.body);
    console.log('Received message:', message, 'From:', from);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Enviar mensaje a Teams
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    const payload = JSON.stringify({ text: message });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Teams');
    }

    // Enviar mensaje a Pusher
    await pusher.trigger('my-channel', 'my-event', { message, from });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Message sent to Teams and Pusher' })
    };
  } catch (error) {
    console.error('Error:', error.message);

    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
