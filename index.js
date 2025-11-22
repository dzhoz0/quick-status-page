const express = require('express');
const fs = require('fs');
const path = require('path');
const checkStatus = require("./utils/checkStatus");
const sendEmail = require("./utils/email");

const app = express();
const port = 3000;

const STATUS_FILE = path.join(__dirname, "data", "statuses.json");
const SITES_FILE = path.join(__dirname, "config", "sites.json");
const INTERVAL = 60 * 1000;

const sites = JSON.parse(fs.readFileSync(SITES_FILE).toString());

let statuses = {};
if (fs.existsSync(STATUS_FILE)) {
    statuses = JSON.parse(fs.readFileSync(STATUS_FILE).toString());
} else {
    sites.forEach(site => statuses[site.name] = { status: "unknown" });
}

function saveStatuses() {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(statuses, null, 2));
}

async function monitorSites() {
    for(const site of sites) {
        const prevStatus = statuses[site.name]?.status || "unknown";
        const currentStatus = await checkStatus(site.url, site.retries);

        statuses[site.name] = { status: currentStatus, lastChecked: new Date() };
        saveStatuses();

        if (prevStatus !== currentStatus) {
          if (prevStatus === "up" && currentStatus === "down") {
              console.log(`${site.name} is DOWN. Sending alert email.`);
              await sendEmail(
                `ALERT: ${site.name} is DOWN`,
                `${site.name} (${site.url}) went from UP to DOWN at ${new Date()}`
                );
          }
        }
    }
}

setInterval(monitorSites, INTERVAL);
monitorSites();

app.get('/', (req, res) => {
    res.send(statuses);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

