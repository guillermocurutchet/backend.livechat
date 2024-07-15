const axios = require('axios');
const Pusher = require('pusher');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

exports.handler = async function(req, res) {
    try {
        console.log('Event Body:', req.body);

        if (!req.body) {
            throw new Error('Request body is missing');
        }

        const { message, from } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Parsed Message:', message);
        console.log('Parsed From:', from);

        // Enviar mensaje a Make
        const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
        console.log('Sending message to Make:', makeWebhookUrl);
        try {
            const makeResponse = await axios.post(makeWebhookUrl, {
                text: `${from}: ${message}`
            });
            console.log('Response from Make:', makeResponse.status, makeResponse.data);
        } catch (makeError) {
            console.error('Error sending to Make:', makeError.response ? makeError.response.data : makeError.message);
        }

        // Enviar mensaje a Pusher para actualizar el chat en el sitio web
        console.log('Sending message to Pusher');
        try {
            const pusherResponse = await pusher.trigger('my-channel', 'my-event', {
                message: message,
                from: from
            });
            console.log('Response from Pusher:', pusherResponse);
        } catch (pusherError) {
            console.error('Error sending to Pusher:', pusherError.message);
        }

        // Enviar mensaje a Microsoft Teams
        const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;
        console.log('Sending message to Teams:', teamsWebhookUrl);
        try {
            const teamsResponse = await axios.post(teamsWebhookUrl, {
                text: `${from}: ${message}`
            });
            console.log('Response from Teams:', teamsResponse.status, teamsResponse.data);
        } catch (teamsError) {
            console.error('Error sending to Teams:', teamsError.response ? teamsError.response.data : teamsError.message);
        }

        return res.status(200).json({ success: true, message: 'Message sent' });
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Error sending message', details: error.message });
    }
};
