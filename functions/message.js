const axios = require('axios');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

exports.handler = async function(event, context) {
    const { message, from } = JSON.parse(event.body);

    if (!message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Message is required' })
        };
    }

    try {
        // Enviar mensaje a Teams
        const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;
        await axios.post(teamsWebhookUrl, {
            text: `${from}: ${message}`
        });

        // Enviar mensaje a Pusher para actualizar el chat en el sitio web
        await pusher.trigger('my-channel', 'my-event', {
            message: message,
            from: from
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Message sent' })
        };
    } catch (error) {
        console.error('Error sending message:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending message' })
        };
    }
};