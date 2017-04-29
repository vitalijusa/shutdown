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
    var track = params.track;
    var uptime = os.uptime();
    var now = moment();
    var lastCheck = moment(track.lastCheck);
    var mail = new Mail(params.email.login.user, 
                        params.email.login.pass,
                        params.email.sender, 
                        params.email.recepient);
    // var pubnub = new Pubnub("Checker", params.pubnub.publishKey, params.pubnub.subscribeKey);

    if (firstTimeToday(lastCheck, now)) {
        // reset params
        track.uptime = 0;
        track.firstCheckDate = now.format();        
    }

    track.uptime = track.uptime + CHECK_INTERVAL/1000;
    track.lastCheck = now.valueOf();    
    track.lastCheckDate = now.format();    

    console.log(track);
    configUtil.saveConfig(configFile, params);

    if (firstTimeToday(lastCheck, now)) {
        mail.send("Start", JSON.stringify(track));
    }
    if (track.uptime > MAX_UPTIME) {
        mail.send("Shutdown", JSON.stringify(track));
        shutdown();
    }

    // pubnub.hereNow();
};

setInterval(check, CHECK_INTERVAL);
check();

function firstTimeToday(lastCheck, now) {
    return lastCheck.dayOfYear() !== now.dayOfYear();
}

function shutdown() {

}

