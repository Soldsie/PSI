var _ = require('underscore')._;

var mongoose = require('mongoose');
require('../model/media.js');
require('../model/comment.js');
require('../model/tweet.js');
var Media = mongoose.model('Media');
var Comment = mongoose.model('Comment');
var Tweet = mongoose.model('Tweet')


var groupTweetsByDate = function(tag, callback) {
  var query;
  if(tag) {
    console.log('have tag');
    var brand = tag.split('purse');
    var q = brand[0] + ' purse';

    query = Tweet.find().where('q').equals(q);
  }
  else {
    console.log('no tag');

    query = Tweet.find();
  }

  query.exec(function(err, results) {

    var data = _.map(results, function(tweet) {
      var t = tweet.toObject();
      t.created_date = new Date(t.created_at);
      t.type = 'tweet';
      return t;
    })

    var data = _.groupBy(data, function(d) {
      var month = d.created_date.getMonth();
      var date = d.created_date.getDate();
      var year = d.created_date.getFullYear();

      return [month, date, year].join('/');
    })

    callback(null, data);
  })

}

var groupMediaByDate = function(tag, callback) {
  var query;
  if(tag) {
    query = Media.find().where('tag').equals(tag);
  }
  else {
    query = Media.find();
  }

  query.exec(function(err, results) {

    var data = _.map(results, function(tweet) {
      var t = tweet.toObject();
      t.created_date = new Date(t.created_time*1000);
      t.type = 'media';
      return t;
    })

    var data = _.groupBy(data, function(d) {
      var month = d.created_date.getMonth();
      var date = d.created_date.getDate();
      var year = d.created_date.getFullYear();

      return [month, date, year].join('/');
    })

    callback(null, data);
  })

}

var groupCommentsByDate = function(tag, callback) {
  if(tag) {
    callback(null, []);
    return
  }

  var query = Comment.find();

  query.exec(function(err, results) {

    var data = _.map(results, function(tweet) {
      var t = tweet.toObject();
      t.created_date = new Date(t.created_time*1000);
      t.type = 'comment';
      return t;
    })

    var data = _.groupBy(data, function(d) {
      var month = d.created_date.getMonth();
      var date = d.created_date.getDate();
      var year = d.created_date.getFullYear();

      return [month, date, year].join('/');
    })

    callback(null, data);
  })
}

var sortByDate = function(data) {
  // date represenation is human readable mm/dd/year
  // javascript month is 0 indexed
  // var temp = data.date.split('/');
  // var date = new Date(temp[2], temp[0]-1, temp[1])
  // return date;
  return data.date;
}

var dataByDayAndType = function(tag, callback) {
  allData = {};

  groupTweetsByDate(tag, function(err, tweets) {
    allData.tweet = tweets;
    groupMediaByDate(tag, function(err, media) {
      allData.media = media;

      groupCommentsByDate(tag, function(err, comments) {
        allData.comment = comments;

        var media = [];
        var comments = [];
        var tweets = [];

        for(var type in allData) {
          if(allData.hasOwnProperty(type)) {        
            // for each data type (media, comments, tweets)
            var data = allData[type];
            for(var date in data) {
              if(data.hasOwnProperty(date)) {
                var mdy = date.split('/');

                var dateObj = new Date(mdy[2], mdy[0], mdy[1])
                dateObj = Date.parse(dateObj);

                if(type == 'media') {
                  media.push({date: dateObj, items: data[date]})
                } else if(type == 'comment') {
                  comments.push({date: dateObj, items: data[date]})
                } else if(type == 'tweet') {
                  tweets.push({date: dateObj, items: data[date]})
                }
              }

            }
          }
        }

        // sort list by date
        media = _.sortBy(media, sortByDate);
        comments = _.sortBy(comments, sortByDate);
        tweets = _.sortBy(tweets, sortByDate);

        callback(null, {media: media, comment: comments, tweet: tweets});
      })
    })
  })
}

var cumulative = function(data) {
  var c = [];
  var curr = 0;
  for(var i=0; i<data.length; i++) {
    curr = curr + data[i].items.length;
    var d = [
      data[i].date,
      curr
    ]
    c.push(d);
  }
  return c;
}

var cumulativeData = function(tag, callback) {
  dataByDayAndType(tag, function(err, data) {
    var media = data.media;
    var comments = data.comment;
    var tweets = data.tweet;

    // cumulative data by type
    var d = {};
    d.mediaCumulative = cumulative(media);
    d.commentCumulative = cumulative(comments);
    d.tweetCumulative = cumulative(tweets);

    callback(null, d);
  });
}


module.exports = {
  dataByDayAndType: dataByDayAndType,
  cumulativeData: cumulativeData,
}