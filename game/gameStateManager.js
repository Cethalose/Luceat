const fs = require("fs");
const { getCurrentScene, saveScene } = require("./sceneManager");

function savePlayer(player, playerPath) {
    fs.writeFileSync(playerPath, JSON.stringify(player, null, 2));
}

function giveItem(characterData, itemName) {
    if (!characterData || !characterData.player) {
        return {
            success: false,
            message: "No character found."
        };
    }

    const player = characterData.player;

    if (!player.character.inventory) {
        player.character.inventory = [];
    }

    if (player.character.inventory.includes(itemName)) {
        return {
            success: false,
            message: `${player.character.name} already has ${itemName}.`
        };
    }

    player.character.inventory.push(itemName);
    savePlayer(player, characterData.playerPath);

    return {
        success: true,
        message: `${player.character.name} received ${itemName}.`
    };
}

function removeVisibleObject(objectName) {
    const scene = getCurrentScene();

    if (!scene || !scene.visibleObjects) {
        return {
            success: false,
            message: "No current scene found."
        };
    }

    scene.visibleObjects = scene.visibleObjects.filter(
        object => object.toLowerCase() !== objectName.toLowerCase()
    );

    if (!scene.notes) {
        scene.notes = [];
    }

    scene.notes.push(`${objectName} was removed from the scene.`);

    saveScene(scene);

    return {
        success: true,
        message: `${objectName} removed from the scene.`
    };
}

function hasItem(characterData, itemName) {
    if (!characterData || !characterData.player) {
        return false;
    }

    const inventory = characterData.player.character.inventory || [];

    return inventory.includes(itemName);
}

function unlockSceneObject(objectName, requiredItem, characterData) {
    if (!hasItem(characterData, requiredItem)) {
        return {
            success: false,
            message: `${characterData.player.character.name} needs ${requiredItem} to unlock ${objectName}.`
        };
    }

    const scene = getCurrentScene();

    if (!scene) {
        return {
            success: false,
            message: "No current scene found."
        };
    }

    if (!scene.notes) {
        scene.notes = [];
    }

    scene.notes.push(`${objectName} was unlocked using ${requiredItem}.`);
    saveScene(scene);

    return {
        success: true,
        message: `${characterData.player.character.name} unlocked ${objectName} using ${requiredItem}.`
    };
}

module.exports = {
    giveItem,
    removeVisibleObject,
    hasItem,
    unlockSceneObject
};