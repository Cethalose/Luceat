const { unlockSceneObject } = require("../gameStateManager");

function handleDoorAction(intent, characterData) {
    if (intent.action === "unlock" && intent.target === "door") {
        const result = unlockSceneObject(
            "Massive Stone Door",
            "Tarnished Brass Key",
            characterData
        );

        return result.message;
    }

    return null;
}

module.exports = {
    handleDoorAction
};