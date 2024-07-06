const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

exports.handler = async function(event, context) {
  const { message } = JSON.parse(event.body);
  console.log('Received message:', message); // Log para debugging

  await pusher.trigger('my-channel', 'my-event', { message });

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'Message sent' })
  };
};
