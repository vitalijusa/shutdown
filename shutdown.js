const os = require('os');
const moment = require('moment');
const configUtil = require('./configUtil.js');
const Pubnub = require('./pubnub.js').Pubnub;

const CHECK_INTERVAL = 5*60 * 1000; // 5 minutes
var configFile = "param.json";

var check = function() {
    var params = configUtil.loadConfig(configFile);
    var uptime = os.uptime();
    var now = moment();
    var lastCheck = moment(params.lastCheck);
    var pubnub = new Pubnub("Checker", params.pubnubPublishKey, params.pubnubSubscribeKey);

    if (!lastCheckWasToday(lastCheck, now)) {
        // reset params
        params.uptime = uptime;
        params.firstCheck = now.format();        
    }

    params.uptime = getUpdatedUptime(params.uptime, uptime, lastCheck, now.valueOf());
    params.lastCheck = now.valueOf();    

    console.log(params);
    configUtil.saveConfig(configFile, params);

    pubnub.hereNow();
};
check();

function lastCheckWasToday(lastCheck, now) {
    return lastCheck.dayOfYear() === now.dayOfYear();
}

function getUpdatedUptime(lastUptime, uptime, lastCheck, now) {
    var newUptime = 0;
    var buffer = 5000;

    if (lastUptime <= uptime) {
        newUptime = uptime;
    } else {
        if (lastCheck + CHECK_INTERVAL + buffer > now) {
            newUptime = lastUptime + checkInterval;
        } else {
            newUptime = lastUptime + uptime;
        }
    }
    return newUptime;
}

