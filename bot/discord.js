require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { askAI } = require("../ai/ollama");
const { startCharacterCreation, continueCharacterCreation } = require("../game/characterCreation");
const { loadCharacterForUser } = require("../game/characterManager");
const { addSessionEvent } = require("../game/sessionManager");
const { getInventoryText } = require("../game/inventoryManager");
const serverConfig = require("../config/server.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!create") {
        const reply = startCharacterCreation(message.author);
        await message.reply(reply);
        return;
    }

    if (message.content === "!inventory") {
        const character = loadCharacterForUser(message.author);
        const reply = getInventoryText(character);
        await message.reply(reply);
        return;
    }

    const creationReply = continueCharacterCreation(message.author, message.content);

    if (creationReply) {
        await message.reply(creationReply);
        return;
    }

    if (message.channel.id !== serverConfig.discord.gameChannelId) return;

    if (!message.content.startsWith("!luceat ")) return;

    const playerMessage = message.content.replace("!luceat ", "");

    await message.channel.sendTyping();

    const character = loadCharacterForUser(message.author);
    const aiResponse = await askAI(playerMessage, character);

    if (character) {
        addSessionEvent(`${character.character.name}: ${playerMessage}`);
    }

    await message.reply(aiResponse);
});

client.login(process.env.DISCORD_TOKEN);