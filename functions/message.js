const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

exports.handler = async function(event, context) {
  try {
    const { message, from } = JSON.parse(event.body);
    console.log('Received message:', message); // Log para debugging

    await pusher.trigger('my-channel', 'my-event', { message, from });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Message sent' })
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'Error processing message', error: error.message })
    };
  }
};
