function timestamp() {
    return new Date().toISOString();
}

function log(scope, message) {
    console.log(`[${timestamp()}] [${scope}] ${message}`);
}

function timeStart(label) {
    console.time(label);
}

function timeEnd(label) {
    console.timeEnd(label);
}

module.exports = {
    log,
    timeStart,
    timeEnd
};