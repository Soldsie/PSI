var express = require('express');
var uiController = require('./src/controller/ui-controller');

var init = function init(app) {
    var uiRouter = new express.Router();
    uiRouter.route('/').get(uiController.renderPage);
    app.use('/', uiRouter);
};

module.exports = {
    init: init
};