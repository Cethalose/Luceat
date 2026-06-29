const fs = require("fs");
const path = require("path");

const { getActiveCampaign } = require("./campaignManager");

const playersDir = path.join(__dirname, "..", "data", "players");

function getPartyText() {
    const campaign = getActiveCampaign();

    if (!campaign) {
        return "No active campaign found.";
    }

    if (!campaign.party || campaign.party.length === 0) {
        return `Campaign: ${campaign.name}\n\nNo party members yet.`;
    }

    const members = campaign.party.map(username => {
        const playerPath = path.join(playersDir, `${username}.json`);

        if (!fs.existsSync(playerPath)) {
            return `- ${username} (character file missing)`;
        }

        const player = JSON.parse(fs.readFileSync(playerPath, "utf8"));
        const character = player.character;

        return `- ${character.name}, Level ${character.level} ${character.ancestry} ${character.class}`;
    });

    return `Campaign: ${campaign.name}\n\nCurrent Party:\n\n${members.join("\n")}`;
}

module.exports = {
    getPartyText
};