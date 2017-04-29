var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'UpTimeChecker',
  description: 'Checks for how long PC is running.',
  script: 'shutdown.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();