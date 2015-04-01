var CronJob = require('cron').CronJob;
var http = require('http');
var https = require('https');
var logger = require('./src/util/logger');

http.globalAgent.maxSockets = 200;
https.globalAgent.maxSockets = 200;

logger.info('jobs', 'started scheduling jobs ...');

var dummyJob = new CronJob({
    cronTime: '*/5 * * * * *',
    onTick: function() {
        console.log('=== tick! ===');
    },
    start: false
});
dummyJob.start();

logger.info('jobs', 'done.');