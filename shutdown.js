const os = require('os');
const jsonfile = require('jsonfile');
const configUtil = require('./configUtil.js');

var configFile = "param.json";

console.log(os.uptime());
console.log(configUtil.loadConfig(configFile));