const os = require('os');
const moment = require('moment');
const configUtil = require('./configUtil.js');
const Mail = require('./mail.js').Mail;
const Pubnub = require('./pubnub.js').Pubnub;

const MAX_UPTIME = 2*3600 + 3*60; // 2 h 3 min
const CHECK_INTERVAL = 5*60 * 1000; // 5 min
var configFile = "param.json";

var check = function() {
    var params = configUtil.loadConfig(configFile);
    var uptime = os.uptime();
    var now = moment();
    var lastCheck = moment(params.lastCheck);
    var mail = new Mail(params.email.login.user, 
                        params.email.login.pass,
                        params.email.sender, 
                        params.email.recepient);
    // var pubnub = new Pubnub("Checker", params.pubnub.publishKey, params.pubnub.subscribeKey);

    if (!lastCheckWasToday(lastCheck, now)) {
        mail.send("Start", params);
        // reset params
        params.uptime = uptime;
        params.firstCheck = now.format();        
    }

    params.uptime = getUpdatedUptime(params.uptime, uptime, lastCheck, now.valueOf());
    params.lastCheck = now.valueOf();    

    console.log(params);
    configUtil.saveConfig(configFile, params);

    if (params.uptime > MAX_UPTIME) {
        mail.send("Shutdown", params);
        shutdown();
    }

    // pubnub.hereNow();
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
            newUptime = lastUptime + checkInterval/1000;
        } else {
            newUptime = lastUptime + uptime;
        }
    }
    return newUptime;
}

function shutdown() {

}

