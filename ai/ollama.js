const { buildPrompt } = require("./promptBuilder");

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL = "gemma4:12b";

async function askAI(playerMessage, character = null) {
    const fullPrompt = buildPrompt(playerMessage, character);

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