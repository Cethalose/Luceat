const { giveItem, removeVisibleObject } = require("../gameStateManager");

function handleInventoryAction(intent, characterData) {
    if (intent.action === "take" && intent.target === "Tarnished Brass Key") {
        const itemResult = giveItem(characterData, "Tarnished Brass Key");
        const sceneResult = removeVisibleObject("tarnished brass key");

        return `${itemResult.message} ${sceneResult.message}`;
    }

    return null;
}

module.exports = {
    handleInventoryAction
};