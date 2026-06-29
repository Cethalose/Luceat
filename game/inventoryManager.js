const fs = require("fs");

function savePlayer(player, playerPath) {
    fs.writeFileSync(playerPath, JSON.stringify(player, null, 2));
}

function getInventoryText(player) {
    if (!player || !player.character) {
        return "No character found. Use !create to make one.";
    }

    const inventory = player.character.inventory || [];

    if (inventory.length === 0) {
        return `${player.character.name}'s inventory is empty.`;
    }

    return `${player.character.name}'s inventory:\n\n${inventory.map(item => `- ${item}`).join("\n")}`;
}

function addItemToInventory(player, playerPath, itemName) {
    if (!player || !player.character) {
        return "No character found. Use !create to make one.";
    }

    if (!player.character.inventory) {
        player.character.inventory = [];
    }

    player.character.inventory.push(itemName);

    savePlayer(player, playerPath);

    return `${itemName} added to ${player.character.name}'s inventory.`;
}

module.exports = {
    getInventoryText,
    addItemToInventory
};