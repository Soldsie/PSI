var util = require('util');
var path = require('path');

var conf = {};

conf.output = {
    test: path.join(__dirname, '..', '..', 'reports'),
    coverage: path.join(__dirname, '..', '..', 'coverage')
};

module.exports = conf;