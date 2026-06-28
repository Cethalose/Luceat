const fs = require("fs");
const path = require("path");

const playersDir = path.join(__dirname, "..", "data", "players");
const creationDir = path.join(__dirname, "..", "data", "character_creation");

function getSafeUsername(username) {
    return username.replace(/[^a-z0-9_-]/gi, "_");
}

function getPlayerPath(username) {
    return path.join(playersDir, `${getSafeUsername(username)}.json`);
}

function getCreationPath(userId) {
    return path.join(creationDir, `${userId}.json`);
}

function startCharacterCreation(user) {
    const creationPath = getCreationPath(user.id);

    const creationState = {
        discordUserId: user.id,
        discordUsername: user.username,
        step: "characterName",
        character: {
            name: "",
            ancestry: "",
            class: "",
            level: 1,
            hp: 20,
            maxHp: 20,
            notes: []
        }
    };

    fs.writeFileSync(creationPath, JSON.stringify(creationState, null, 2));

    return `Welcome, ${user.username}. Let's create your character.\n\nWhat is your character's name?`;
}

function continueCharacterCreation(user, message) {
    const creationPath = getCreationPath(user.id);

    if (!fs.existsSync(creationPath)) {
        return null;
    }

    const creationState = JSON.parse(fs.readFileSync(creationPath, "utf8"));

    if (creationState.step === "characterName") {
        creationState.character.name = message;
        creationState.step = "ancestry";

        fs.writeFileSync(
            creationPath,
            JSON.stringify(creationState, null, 2)
        );

        return "Excellent. What is your character's ancestry or race?";
    }

    if (creationState.step === "ancestry") {
    creationState.character.ancestry = message;
    creationState.step = "class";

    fs.writeFileSync(
        creationPath,
        JSON.stringify(creationState, null, 2)
    );

    return "Excellent. What is your character's class?";
}

if (creationState.step === "class") {
    creationState.character.class = message;

    const player = {
        discord: {
            id: creationState.discordUserId,
            username: creationState.discordUsername
        },
        character: creationState.character
    };

    fs.writeFileSync(
        getPlayerPath(creationState.discordUsername),
        JSON.stringify(player, null, 2)
    );

    fs.unlinkSync(creationPath);

    return `Excellent! Your character "${player.character.name}" has been created.\n\nWelcome to Luceat.`;
}

    return "Character creation is currently in an unknown state.";
}

module.exports = {
    startCharacterCreation,
    continueCharacterCreation
};