var logger = require("../util/logger.js");

var mongoose = require('mongoose');
require('../model/media.js');
require('../model/comment.js');
var Media = mongoose.model('Media');
var Comment = mongoose.model('Comment');

var instagram  = require('../service/instagram.js')
var accountant = require('../service/accountant.js')

// burberrypurse has duplicate 3 sets of data 260

var renderPage = function(req, res) {
    // instagram.getRecentTagMedia('michaelkors', {});   // for testing
    var tags = ['michaelkorspurse', 'coachpurse', 'louisvuittonpurse', 'pradapurse', 'hermespurse', 'guccipurse', 'versacepurse'];

    // (function(tag){
    //   instagram.getRecentTagMedia(tag, {});   // for testing
    // })(tags[6])
    accountant.score();

    res.render('main');
};

module.exports = {
    renderPage: renderPage
};