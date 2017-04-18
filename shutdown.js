const os = require('os');
const moment = require('moment');
const configUtil = require('./configUtil.js');

var configFile = "param.json";

var check = function() {
    var params = configUtil.loadConfig(configFile);
    var uptime = os.uptime();
    var now = moment();

    params.firstCheck = now.format();
    params.lastCheck = now.valueOf();
    params.uptime = uptime;

    console.log(params);
    configUtil.saveConfig(configFile, params);
};


check();