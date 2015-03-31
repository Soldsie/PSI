var fs = require('fs');
var constants = require('../constants');
var winston = require('winston');
var config = require('./conf-loader').load();
var util = require('util');
var _ = require('underscore')._;

var logger, errorLogger;

var noColorConsoleTransport = new (winston.transports.Console)({
    colorize: false,
    timestamp: function() {
        // return [YYYY:MM:DD HH:mm:ss UTC]
        return new Date().toISOString().replace(/T/, ' ').replace(/\.[0-9]{3}Z/, ' UTC');
    },
    json: true,
    prettyPrint: true
});

var coloredConsoleTransport = new (winston.transports.Console)({
    colorize: true,
    timestamp: function() {
        // return [YYYY:MM:DD HH:mm:ss UTC]
        return new Date().toISOString().replace(/T/, ' ').replace(/\.[0-9]{3}Z/, ' UTC');
    },
    json: true,
    prettyPrint: true
});

var loggerComponents = {
    'Development': {
        log: {
            transports: [noColorConsoleTransport],
            exceptionTransports: [noColorConsoleTransport]
        },
        err: {
            transports: [coloredConsoleTransport],
            exceptionTransports: [coloredConsoleTransport]
        } 
    }
};

// ================== private functions ===================
var initLogger = function initLogger() {
    if(logger) {
        return logger;
    }
    return new (winston.Logger)({
        transports: loggerComponents[constants.env].log.transports,
        exceptionHandlers: loggerComponents[constants.env].log.exceptionTransports
    });
};

var initErrorLogger = function initErrorLogger() {
    if(errorLogger) {
        return errorLogger;
    }
    return new (winston.Logger)({
        transports: loggerComponents[constants.env].log.transports,
        exceptionHandlers: loggerComponents[constants.env].log.exceptionTransports
    });
};

var logMessage = function logMessage(logInstance, level, args) {
    var _args = [level].splice(1, 0, _.values(args));
    logInstance.apply(logInstance, _args);
};
// ================== public functions ====================
// args contains all values to be fed into winston, such that
// args[0] is the message;
// args[-1] is metadata and,
// everything in between is to be formatted with the message
var info = function info() {
    var log = initLogger();
    logMessage(log, 'info', arguments);
};

var debug = function debug() {
    var log = initLogger();
    logMessage(log, 'debug', arguments);
};

var error = function error() {
    var errLog = initErrorLogger();
    logMessage(log, 'error', arguments);
}

module.exports = {
    info: info,
    debug: debug,
    error: error
};