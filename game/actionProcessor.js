const { log } = require("../utils/logger");
const { handleDoorAction } = require("./actions/doorActions");
const { handleInventoryAction } = require("./actions/inventoryActions");
const { parseIntent } = require("./intentParser");

function processPlayerAction(playerMessage, characterData) {
    if (!characterData || !characterData.player) {
        return null;
    }

    const intent = parseIntent(playerMessage);

log("Action", `Processing: "${playerMessage}"`);
log("Intent", JSON.stringify(intent));

const inventoryResult = handleInventoryAction(intent, characterData);
if (inventoryResult) return inventoryResult;

const doorResult = handleDoorAction(intent, characterData);
if (doorResult) return doorResult;

    return null;
}

module.exports = {
    processPlayerAction
};