const fs = require("fs");
const path = require("path");
const { getRecentHistory } = require("../game/sessionManager");

const promptPath = path.join(__dirname, "..", "prompts", "dungeon_master.txt");
const worldPath = path.join(__dirname, "..", "data", "world.json");

function buildPrompt(playerMessage, character = null) {
    const dungeonMasterPrompt = fs.readFileSync(promptPath, "utf8");
    const worldData = JSON.parse(fs.readFileSync(worldPath, "utf8"));

    const characterSection = character ? `
Current Player Character:
The player sending this message controls this character.

Name: ${character.character.name}
Ancestry: ${character.character.ancestry}
Class: ${character.character.class}
Level: ${character.character.level}

Narration rule:
When describing this player's action, refer to the character by name when it sounds natural.
` : "";

    return `
${dungeonMasterPrompt}

Campaign:
${worldData.campaignName}

Current Scene:
Location: ${worldData.currentScene.location}
Summary: ${worldData.currentScene.summary}

Visible Choices:
${worldData.currentScene.visibleChoices.map(choice => `- ${choice}`).join("\n")}

Recent Session History:
${getRecentHistory().map(event => `- ${event}`).join("\n")}

${characterSection}

Player Action:
${playerMessage}
`;
}

module.exports = {
    buildPrompt
};