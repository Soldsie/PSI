var express = require('express');
var uiController = require('./src/controller/ui-controller');
var rankApiController = require('./src/controller/rank-api-controller');
var graphApiController = require('./src/controller/graph-api-controller');

var init = function init(app) {
    var uiRouter = new express.Router();
    uiRouter.route('/').get(uiController.renderPage);
    app.use('/', uiRouter);

    var rankApiRouter = new express.Router();
    rankApiRouter.route('/:category').get(rankApiController.rankByCategory);
    app.use('/api/rank', rankApiRouter);

    var graphApiRouter = new express.Router();
    graphApiRouter.route('/:tag?').get(graphApiController.buildGraph);
    app.use('/api/graph', graphApiRouter);

};

module.exports = {
    init: init
};