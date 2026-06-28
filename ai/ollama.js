const fs = require("fs");
const path = require("path");

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL = "gemma4:12b";

const promptPath = path.join(__dirname, "..", "prompts", "dungeon_master.txt");
const worldPath = path.join(__dirname, "..", "data", "world.json");

async function askAI(playerMessage) {
    const dungeonMasterPrompt = fs.readFileSync(promptPath, "utf8");
    const worldData = JSON.parse(fs.readFileSync(worldPath, "utf8"));

    const fullPrompt = `
${dungeonMasterPrompt}

Campaign:
${worldData.campaignName}

Current Scene:
Location: ${worldData.currentScene.location}
Summary: ${worldData.currentScene.summary}

Visible Choices:
${worldData.currentScene.visibleChoices.map(choice => `- ${choice}`).join("\n")}

Player:
${playerMessage}
`;

    const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: MODEL,
            prompt: fullPrompt,
            stream: false
        })
    });

    const data = await response.json();

    return data.response || "No response from AI.";
}

module.exports = {
    askAI
};