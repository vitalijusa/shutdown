const jsonfile = require('jsonfile');
jsonfile.spaces = 4;

module.exports = {
    loadConfig: loadConfig,
    saveConfig: saveConfig
};

function loadConfig(path) {
    return jsonfile.readFileSync(path);
}

function saveConfig(path, configObj) {
    jsonfile.writeFileSync(path, configObj);
}
