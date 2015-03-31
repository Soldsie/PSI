var fs = require('fs');
var constants = require('../constants');
var winston = require('winston');
var config = require('./conf-loader').load();
var util = require('util');
var _ = require('underscore')._;

var logger, errorLogger, jobLogger, jobErrorLogger;

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

var jobLogFileTransport = new (winston.transports.File)({
    prettyPrint: true,
    timestamp: true,
    filename: config.server.logs.jobLog
});

var jobErrLogFileTransport = new (winston.transports.File)({
    prettyPrint: true,
    timestamp: true,
    filename: config.server.logs.jobError
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
        },
        jobLog: {
            transports: [jobLogFileTransport],
            exceptionTransports: [jobErrLogFileTransport]
        },
        jobError: {
            transports: [jobErrLogFileTransport],
            exceptionTransports: [jobErrLogFileTransport]
        }
    }
};

// ================== private functions ===================
var initLogger = function initLogger() {
    if(arguments[0] !== 'jobs') {
        if(jobLogger) {
            jobLogger: new (winston.Logger)({
                transports: loggerComponents[constants.env].log.transports,
                exceptionHandlers: loggerComponents[constants.env].log.exceptionTransports
            });
        }
        return jobLogger;
    }
    else {
        if(!logger) {
            logger = new (winston.Logger)({
                transports: loggerComponents[constants.env].log.transports,
                exceptionHandlers: loggerComponents[constants.env].log.exceptionTransports
            });
        }        
        return logger;
    }
};

var initErrorLogger = function initErrorLogger() {
    if(!errorLogger) {
        errorLogger = new (winston.Logger)({
            transports: loggerComponents[constants.env].jobLog.transports,
            exceptionHandlers: loggerComponents[constants.env].jobError.exceptionTransports
        });
    }
    return errorLogger;
};

var logMessage = function logMessage(logInstance, level, args) {
    var spliceStart = 1;
    if(args[0] === 'jobs') {
        spliceStart = 2;
    }
    var _args = [level].splice(spliceStart, 0, _.values(args));
    logInstance.apply(logInstance, _args);
};
// ================== public functions ====================
// server: if it's 'jobs', it will use jobs logger config
// 
// the remaining args contains all values to be fed into winston, such that
// args[0] is the message;
// args[-1] is metadata and,
// everything in between is to be formatted with the message
var info = function info() {
    var log = arguments[0] === 'jobs' ? initLogger('jobs') : initLogger();
    logMessage(log, 'info', arguments);
};

var debug = function debug() {
    var log = arguments[0] === 'jobs' ? initLogger('jobs') : initLogger();
    logMessage(log, 'debug', arguments);
};

var error = function error() {
    var log = arguments[0] === 'jobs' ? initLogger('jobs') : initLogger();
    logMessage(log, 'error', arguments);
}

module.exports = {
    info: info,
    debug: debug,
    error: error
};