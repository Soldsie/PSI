var _ = require('underscore')._;
var util = require('util');
var constants = require('../constants');

var appEnv = constants.env;
var defaultConf = require('../conf/config.default');
var requestedConf = require(util.format('../conf/config.%s', appEnv));

var load = function load() {
    return _.extend(defaultConf, requestedConf);
};

module.exports = {
    load: load
};