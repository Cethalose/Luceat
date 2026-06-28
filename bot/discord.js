require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { askAI } = require("../ai/ollama");
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

    if (message.channel.id !== serverConfig.discord.gameChannelId) return;
    
    if (!message.content.startsWith("!luceat ")) return;

    const playerMessage = message.content.replace("!luceat ", "");

    await message.channel.sendTyping();

    const aiResponse = await askAI(playerMessage);

    await message.reply(aiResponse);
});

client.login(process.env.DISCORD_TOKEN);