var cron = require('cron');
var http = require('http');
var https = require('https');

http.globalAgent.maxSockets = 200;
https.globalAgent.maxSockets = 200;

// TODO: well, create jobs :-)