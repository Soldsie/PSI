var mongoose = require('mongoose');
require('../model/media.js');
require('../model/comment.js');
require('../model/tweet.js');
var Media = mongoose.model('Media');
var Comment = mongoose.model('Comment');
var Tweet = mongoose.model('Tweet');

var instagram = require('./instagram.js');
var _ = require('underscore')._;


// instagram
var instagramMapReduce = {};

instagramMapReduce.map = function () { 
    emit(this.tag, {comment: parseInt(this.comments.count), like: parseInt(this.likes.count)} );
}

instagramMapReduce.reduce = function (k, vals) {
    var commentScore = 0;
    var likeScore = 0;
    for(var i=0; i<vals.length; i++) {
        var val = vals[i];
        commentScore += val.comment;
        likeScore += val.like;
    }
    return {comment: commentScore, like: likeScore };
}

var scoreInstagram = function(callback) { 
    Media.mapReduce(instagramMapReduce, callback)
}

// twitter
var twitterMapReduce = {};

twitterMapReduce.map = function () { 
    emit(this.q.replace(/ /g, ''), {count: 1, retweetCount: parseInt(this.retweet_count)});
}

twitterMapReduce.reduce = function (k, vals) {
    var count = 0;
    var retweets = 0;
    for(var i=0; i<vals.length; i++) {
        var val = vals[i];
        count += val.count;
        retweets += val.retweetCount;
    }
    return {count: count, retweetCount: retweets}
}

var scoreTwitter = function(callback) { 
    Tweet.mapReduce(twitterMapReduce, callback)
}

module.exports = {
    scoreInstagram: scoreInstagram,
    scoreTwitter: scoreTwitter,
};