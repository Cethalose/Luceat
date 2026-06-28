const fs = require("fs");
const path = require("path");

const playersDir = path.join(__dirname, "..", "data", "players");

function getSafeUsername(username) {
    return username.replace(/[^a-z0-9_-]/gi, "_");
}

function getPlayerPath(username) {
    return path.join(playersDir, `${getSafeUsername(username)}.json`);
}

function loadCharacterForUser(user) {
    const playerPath = getPlayerPath(user.username);

    if (!fs.existsSync(playerPath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(playerPath, "utf8"));
}

module.exports = {
    loadCharacterForUser
};