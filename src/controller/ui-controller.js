var logger = require("../util/logger.js");

var mongoose = require('mongoose');
require('../model/media.js');
require('../model/comment.js');
require('../model/tweet.js');
var Media = mongoose.model('Media');
var Comment = mongoose.model('Comment');
var Tweet = mongoose.model('Tweet')

var instagram  = require('../service/instagram.js');
var twitter = require('../service/twitter.js');
var accountant = require('../service/accountant.js');

var graphData = require('../service/graph-data.js');

// burberrypurse has duplicate 3 sets of data 260

var renderPage = function(req, res) {
    // instagram.getRecentTagMedia('michaelkors', {});   // for testing
    var brands = ['michaelkors purse', 'coach purse', 'louisvuitton purse', 'prada purse', 'hermes purse', 'gucci purse'];
    // 176, 700, 507, 320, 60, 700

    res.render('main');
};

module.exports = {
    renderPage: renderPage
};