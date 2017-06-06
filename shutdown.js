const os = require('os');
const moment = require('moment');
const momentDurationFormat = require('moment-duration-format');
const strFormat = require('string-format');
const configUtil = require('./configUtil.js');
const Mail = require('./mail.js').Mail;
const Pubnub = require('./pubnub.js').Pubnub;

const MAX_UPTIME = 2*3600 + 3*60; // 2 h 3 min
const CHECK_INTERVAL = 5*60 * 1000; // 5 min
const SHUTDOWN_NOTIFY_INTERVAL = 4 * CHECK_INTERVAL / 1000;

var shutDownNotifyTime = 0;

const dateFormat = "YYYY-MM-DD HH:mm:ss";
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
        track.firstCheck = now.valueOf();        
        track.firstCheckDate = now.format(dateFormat);        
    }

    track.uptime = track.uptime + CHECK_INTERVAL/1000;
    track.lastCheck = now.valueOf();    
    track.lastCheckDate = now.format(dateFormat);    

    console.log(formatParams(track));
    configUtil.saveConfig(configFile, params);

    if (firstTimeToday(lastCheck, now)) {
        mail.send("Start", formatParams(track));
    }
    if (track.uptime > MAX_UPTIME && track.uptime > shutDownNotifyTime) {
        mail.send("Shutdown", formatParams(track));
        shutdown();
        shutDownNotifyTime = track.uptime + SHUTDOWN_NOTIFY_INTERVAL; 
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

function formatParams(track) {
    var str = "";
    str = str + strFormat("up time: {}\r\n", formatTime(track.uptime));
    str = str + strFormat("last check: {lastCheckDate}\r\n", track);
    str = str + strFormat("first check: {firstCheckDate}\r\n", track);
    return str;
}

function formatTime(seconds) {
    return moment.duration(seconds, "seconds").format("HH:mm:ss");
}

