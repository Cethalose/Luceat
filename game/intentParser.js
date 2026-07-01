function parseIntent(playerMessage) {
    const message = playerMessage.toLowerCase();

    if (
        (message.includes("unlock") || message.includes("open") || message.includes("use")) &&
        (message.includes("door") || message.includes("lock")) &&
        message.includes("key")
    ) {
        return {
            action: "unlock",
            target: "door",
            tool: "Tarnished Brass Key"
        };
    }

    if (
        (message.includes("take") || message.includes("pick up") || message.includes("grab")) &&
        message.includes("key")
    ) {
        return {
            action: "take",
            target: "Tarnished Brass Key"
        };
    }

    return {
        action: "unknown",
        target: null,
        tool: null
    };
}

module.exports = {
    parseIntent
};