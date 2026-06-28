const fs = require("fs");
const path = require("path");

const sessionPath = path.join(__dirname, "..", "data", "session.json");

function initializeSession() {
    if (!fs.existsSync(sessionPath)) {
        fs.writeFileSync(
            sessionPath,
            JSON.stringify({ history: [] }, null, 2)
        );
    }
}

function addSessionEvent(event) {
    initializeSession();

    const session = JSON.parse(fs.readFileSync(sessionPath, "utf8"));

    session.history.push(event);

    // Keep only the most recent 20 events
    session.history = session.history.slice(-20);

    fs.writeFileSync(
        sessionPath,
        JSON.stringify(session, null, 2)
    );
}

function getRecentHistory() {
    initializeSession();

    return JSON.parse(
        fs.readFileSync(sessionPath, "utf8")
    ).history;
}

module.exports = {
    addSessionEvent,
    getRecentHistory
};