var ig = require('instagram-node').instagram();

// models
var mongoose = require('mongoose');
require('../model/media.js')
require('../model/comment.js')
var Media = mongoose.model('Media')
var Comment = mongoose.model('Comment')

ig.use({ client_id: '3dbd57fca6124ce890d64687a52e935d',
         client_secret: '9470a8405ea3433a9c1f551c79e39280' });

var count = 0;

var getRecentTagMedia = function getRecentTagMedia(tag, options, callback) {
    console.log(tag);
    count = 0;    
    ig.tag_media_recent(tag, options, paginate);
}

var regex = /purse/i;

var paginate = function paginate(err, result, pagination, remaining, limit) {
    console.log("count " + count + " " + "API " + remaining);
    var tags = ['michaelkorspurse', 'coachpurse', 'louisvuittonpurse', 'pradapurse', 'hermespurse', 'guccipurse', 'versace'];

    for(var i=0; i<result.length; i++) {
        var instagramMedia = result[i];

        if(instagramMedia.caption) {
            if(instagramMedia.comments.count + instagramMedia.likes.count > 5 
                && regex.test(instagramMedia.caption.text)) {
                instagramMedia.tag = tags[6];
                var media = new Media(instagramMedia);

                media.save({}, function(err, media) {
                    count += 1;
                });
                saveMediaComments(instagramMedia);
            }
        }
    }

    if(pagination.next && count < 751) {
        pagination.next(paginate); // Will get second page results 
    } else {
        console.log("DONE");
    }
};

var saveMediaComments = function saveMediaComments(media) {
    comments = media.comments.data;
    for(var i=0; i<comments.length; i++) {
        var data = comments[i];
        data['media_id'] = media.id;
        var comment = new Comment(data);
        comment.save();
    }
}

module.exports = {
    getRecentTagMedia: getRecentTagMedia
};