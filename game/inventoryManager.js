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

module.exports = {
    getInventoryText
};