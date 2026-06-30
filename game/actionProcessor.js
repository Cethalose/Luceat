const { giveItem, removeVisibleObject } = require("./gameStateManager");
const { log } = require("../utils/logger");

function processPlayerAction(playerMessage, characterData) {
    if (!characterData || !characterData.player) {
        return null;
    }

    const message = playerMessage.toLowerCase();
    log("Action", `Processing: "${playerMessage}"`);

    if (message.includes("take") && message.includes("key")) {
        log("Action", "Detected TAKE KEY action.");
        const itemResult = giveItem(characterData, "Tarnished Brass Key");
        const sceneResult = removeVisibleObject("tarnished brass key");

return `${itemResult.message} ${sceneResult.message}`;
    }

    return null;
}

module.exports = {
    processPlayerAction
};