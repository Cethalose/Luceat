const fs = require("fs");
const path = require("path");

const serverConfig = require("../config/server.json");

function getScenePath() {
    return path.join(
        __dirname,
        "..",
        "data",
        "campaigns",
        serverConfig.activeCampaign,
        "scene.json"
    );
}

function getCurrentScene() {
    const scenePath = getScenePath();

    if (!fs.existsSync(scenePath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(scenePath, "utf8"));
}

function saveScene(scene) {
    fs.writeFileSync(getScenePath(), JSON.stringify(scene, null, 2));
}

module.exports = {
    getCurrentScene,
    saveScene
};