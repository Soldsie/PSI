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
        log: '/tmp/psi-server.log',
        error: '/tmp/psi-server.err'
    }
};

module.exports = conf;