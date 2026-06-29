const fs = require("fs");
const path = require("path");

const playersDir = path.join(__dirname, "..", "data", "players");

function getSafeUsername(username) {
    return username.replace(/[^a-z0-9_-]/gi, "_");
}

function getPlayerPath(userId) {
    return path.join(playersDir, `${userId}.json`);
}

function loadCharacterForUser(user) {
    const playerPath = getPlayerPath(user.id);

    if (!fs.existsSync(playerPath)) {
        return null;
    }

    const player = JSON.parse(fs.readFileSync(playerPath, "utf8"));

    return {
        player,
        playerPath
    };
}

module.exports = {
    loadCharacterForUser
};