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
    const { message } = JSON.parse(event.body);
    console.log('Received message:', message); // Log para debugging

    await pusher.trigger('my-channel', 'my-event', { message });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Message sent' })
    };
  } catch (error) {
    console.error('Error parsing message:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ status: 'Invalid JSON input' })
    };
  }
};
