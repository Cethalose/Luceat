const fs = require("fs");
const path = require("path");

const serverConfig = require("../config/server.json");

function getCampaignPath() {
    return path.join(
        __dirname,
        "..",
        "data",
        "campaigns",
        serverConfig.activeCampaign,
        "campaign.json"
    );
}

function getActiveCampaign() {
    const campaignPath = getCampaignPath();

    if (!fs.existsSync(campaignPath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(campaignPath, "utf8"));
}

function saveCampaign(campaign) {
    fs.writeFileSync(
        getCampaignPath(),
        JSON.stringify(campaign, null, 2)
    );
}

function joinCampaign(username) {
    const campaign = getActiveCampaign();

    if (!campaign) {
        return "No active campaign.";
    }

    if (!campaign.party.includes(username)) {
        campaign.party.push(username);
        saveCampaign(campaign);
    }

    return campaign;
}

module.exports = {
    getActiveCampaign,
    joinCampaign
};