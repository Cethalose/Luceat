require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { askAI } = require("../ai/ollama");
const { startCharacterCreation, continueCharacterCreation } = require("../game/characterCreation");
const { loadCharacterForUser } = require("../game/characterManager");
const { addSessionEvent } = require("../game/sessionManager");
const { getInventoryText, addItemToInventory } = require("../game/inventoryManager");
const serverConfig = require("../config/server.json");
const { getPartyText } = require("../game/partyManager");
const { joinCampaign } = require("../game/campaignManager");

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
        const characterData = loadCharacterForUser(message.author);
        const reply = getInventoryText(characterData?.player);
        await message.reply(reply);
        return;
    }

if (message.content === "!party") {
    const reply = getPartyText();
    await message.reply(reply);
    return;
}

if (message.content === "!join") {
    const characterData = loadCharacterForUser(message.author);

    if (!characterData) {
        await message.reply("No character found. Use !create first.");
        return;
    }

    const campaign = joinCampaign(message.author.username);

    await message.reply(`${characterData.player.character.name} has joined ${campaign.name}.`);
    return;
}

    if (message.content.startsWith("!give ")) {
    const itemName = message.content.replace("!give ", "").trim();

    const characterData = loadCharacterForUser(message.author);
    const reply = addItemToInventory(
        characterData?.player,
        characterData?.playerPath,
        itemName
    );

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

    const characterData = loadCharacterForUser(message.author);
    const character = characterData?.player;
    const aiResponse = await askAI(playerMessage, character);

    if (character) {
        addSessionEvent(`${character.character.name}: ${playerMessage}`);
    }

    await message.reply(aiResponse);
});

client.login(process.env.DISCORD_TOKEN);