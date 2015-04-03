var _ = require('underscore')._;
var async = require('async');
var twitterAPI = require('node-twitter-api');

// models
var mongoose = require('mongoose');
require('../model/tweet.js');
var Tweet = mongoose.model('Tweet');

var twitter = new twitterAPI({
    consumerKey: 'uxZzPlcWZuLmDiEY3UCiyLgbz',
    consumerSecret: 'BbdIBWHRmNiNCC1RZ4lZTTe4xiXoBxbozI5Z3qo06ZKNPEdMmJ'
});

var accessToken = '3137257747-dNlXz1OIg7nmhYEOlZpcWy7fq0Udbzb0raJDRll';
var accessTokenSecret = 'Nif7K4iXyFPG5Bxlo0cl9lthbxccdf8ptA2P2W9XpNKBj';

var PAGE_SIZE = 100;    // max is 100

var saveTweets = function(tweets, q) {
    for(var i=0; i<tweets.length; i++) {
        var t = tweets[i];
        t['q'] = q;
        var tweet = new Tweet(t);
        tweet.save();
    }
}

var findMinTweet = function(tweets) {
    var minTweet = _.min(tweets, function(tweet){
        return tweet.id;
    })
    return minTweet;
}

var searchTweets = function(q, count, max_id) {
    var pageSize = PAGE_SIZE;

    if(count > PAGE_SIZE){
        count = count - PAGE_SIZE;
    } else {
        pageSize = count;
        count = 0;
    }

    max_id = max_id || null;

    twitter.search({
            q: q,
            count: pageSize,
            max_id: max_id,
        },
        accessToken,
        accessTokenSecret,
        function(error, data, response) {
            console.log('API calls left', response.headers['x-rate-limit-remaining']);
            var statuses = data.statuses;
            saveTweets(statuses, q);
            console.log('number of tweets ' , statuses.length);
            var minTweet = findMinTweet(statuses);
            if(count > 0 && statuses.length == pageSize) searchTweets(q, count, parseInt(minTweet.id));
        }
    );
}

module.exports = {
    searchTweets: searchTweets
}