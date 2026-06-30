const fs = require("fs");
const path = require("path");
const { getRecentHistory } = require("../game/sessionManager");
const { getCurrentScene } = require("../game/sceneManager");

const promptPath = path.join(__dirname, "..", "prompts", "dungeon_master.txt");
const worldPath = path.join(__dirname, "..", "data", "world.json");

function buildPrompt(playerMessage, character = null) {
    const dungeonMasterPrompt = fs.readFileSync(promptPath, "utf8");
    const worldData = JSON.parse(fs.readFileSync(worldPath, "utf8"));
    const currentScene = getCurrentScene();

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
Location: ${currentScene?.location || worldData.currentScene.location}
Summary: ${currentScene?.summary || worldData.currentScene.summary}

Visible Objects:
${currentScene?.visibleObjects?.map(object => `- ${object}`).join("\n") || "None listed."}

Exits:
${currentScene?.exits?.map(exit => `- ${exit}`).join("\n") || "None listed."}

Scene Notes:
${currentScene?.notes?.map(note => `- ${note}`).join("\n") || "None listed."}

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