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
    const { text, from } = JSON.parse(event.body);
    console.log('Received message:', text, 'From:', from);

    if (!text) {
      throw new Error('Message is required');
    }

    await pusher.trigger('my-channel', 'my-event', { message: text, from });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Message sent' })
    };
  } catch (error) {
    console.error('Error:', error.message);

    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
