const os = require('os');
const configUtil = require('./configUtil.js');

var configFile = "param.json";

var check = function() {
    var params = configUtil.loadConfig(configFile);
    var osUptime = os.uptime();

    console.log(os.uptime());
    console.log(params);

    configUtil.saveConfig(params);
};


console.log(os.uptime());
console.log(configUtil.loadConfig(configFile));

