const axios = require('axios');

async function checkStatus(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url);
            if (response.status >= 200 && response.status < 400) {
                return "up";
            }
        } catch(err) {
            console.log("Attempt", i + 1, "failed:", err.message, "for URL:", url);
        }
    }
    return "down";
}

module.exports = checkStatus;