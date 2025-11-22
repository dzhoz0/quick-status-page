const axios = require("axios");
const webhookUrl = process.env.DISCORD_WEBHOOK;

async function sendDiscordMessage(message) {
    try {
        await axios.post(webhookUrl, { content: message });
        console.log("Message sent successfully");
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
}

module.exports = sendDiscordMessage;