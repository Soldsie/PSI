var logger = require("../util/logger.js")

var mongoose = require('mongoose')
require('../model/media.js')
require('../model/comment.js')
var Media = mongoose.model('Media')
var Comment = mongoose.model('Comment')

var instagram  = require('../service/instagram.js')

var renderPage = function(req, res) {
    instagram.getRecentTagMedia('happy', {});   // for testing
    res.render('main');
};

module.exports = {
    renderPage: renderPage
};