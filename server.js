var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var logger = require('./src/util/logger');
var http = require('http');
var https = require('https');
var path = require('path');
var routes = require('./routes');
var constants = require('./src/constants');
var lessMiddleware = require('less-middleware');
var util = require('util');
var config = require('./src/util/conf-loader').load();


http.globalAgent.maxSockets = 20;
https.globalAgent.maxSockets = 20;

var setupMiddleware = function(app) {
    // server logging to stdout
    app.use(morgan('combined', {
        skip: function(req, res) {
            return res.statusCode < 400;
        }
    }));
    // body parser
    app.use(bodyParser.json());    
    // routes
    routes.init(app);
    // error handler
    if(constants.env === 'Development') {
        app.use(errorHandler());
    }
};

var setupUiRendering = function(app) {
    // jade
    app.set('views', './src/view');
    app.set('view engine', 'jade');
    // less middleware (dev only)
    if(constants.env === 'Development') {
        app.use(lessMiddleware({
            pathRoot: path.join(__dirname, 'public', 'stylesheet'),
            src: 'less',
            dest: 'css',
            force: true,
            preprocess: {
                importPaths: function(paths, req) {
                    paths.push(path.join(__dirname, 'node_modules', 'bootstrap', 'less'));
                    return paths;
                }
            }
        }));
    }
    // static
    app.use('/static', express.static('public'));
};

var app = express();
setupUiRendering(app);
setupMiddleware(app);
app.listen(config.server.port);
logger.info('PSI web server started.')