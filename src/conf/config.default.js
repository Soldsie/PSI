var util = require('util');
var path = require('path');

var conf = {};

conf.output = {
    test: path.join(__dirname, '..', '..', 'reports'),
    coverage: path.join(__dirname, '..', '..', 'coverage')    
};

conf.server = {
    baseUrl: 'http://localhost',
    port: 9099,
    logs: {
        jobLog: '/tmp/psi-jobs.log',
        jobError: '/tmp/psi-jobs.err'
    }
};

module.exports = conf;