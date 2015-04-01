var fs = require('fs');
var constants = require('../constants');
var winston = require('winston');
var config = require('./conf-loader').load();
var util = require('util');
var _ = require('underscore')._;

var logger, errorLogger, jobLogger, jobErrorLogger;

var custTimestamp = function() {
    // return [YYYY:MM:DD HH:mm:ss UTC]
    return new Date().toISOString().replace(/T/, ' ').replace(/\.[0-9]{3}Z/, ' UTC');
};

var noColorConsoleTransport = new (winston.transports.Console)({
    colorize: false,
    timestamp: custTimestamp
});

var coloredConsoleTransport = new (winston.transports.Console)({
    colorize: true,
    timestamp: custTimestamp
});

var jobLogFileTransport = new (winston.transports.File)({
    prettyPrint: true,
    timestamp: custTimestamp,
    filename: config.server.logs.jobLog
});

var jobErrLogFileTransport = new (winston.transports.File)({
    prettyPrint: true,
    timestamp: custTimestamp,
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
    if(arguments[0] === 'jobs') {
        if(!jobLogger) {
            jobLogger = new (winston.Logger)({
                transports: loggerComponents[constants.env].jobLog.transports,
                exceptionHandlers: loggerComponents[constants.env].jobLog.exceptionTransports
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
    if(arguments[0] === 'jobs') {
        if(!jobErrorLogger) {
            jobErrorLogger = new (winston.Logger)({
                transports: loggerComponents[constants.env].jobError.transports,
                exceptionHandlers: loggerComponents[constants.env].jobError.exceptionTransports
            });
        }
        return jobErrorLogger;
    }
    else {
        if(!errorLogger) {
            errorLogger = new (winston.Logger)({
                transports: loggerComponents[constants.env].jobLog.transports,
                exceptionHandlers: loggerComponents[constants.env].jobError.exceptionTransports
            });
        }
        return errorLogger;
    }
};

var logMessage = function logMessage(logInstance, level, args) {
    var sliceStart = 0;
    if(args[0] === 'jobs') {
        sliceStart = 1;
    }
    var _args = [level].concat(_.values(args).slice(sliceStart));
    logInstance.log.apply(logInstance, _args);
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
    var log = arguments[0] === 'jobs' ? initErrorLogger('jobs') : initErrorLogger();
    logMessage(log, 'error', arguments);
}

module.exports = {
    info: info,
    debug: debug,
    error: error
};