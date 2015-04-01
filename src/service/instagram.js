var ig = require('instagram-node').instagram();

// models
var mongoose = require('mongoose');
require('../model/media.js')
require('../model/comment.js')
var Media = mongoose.model('Media')
var Comment = mongoose.model('Comment')

ig.use({ client_id: '3dbd57fca6124ce890d64687a52e935d',
         client_secret: '9470a8405ea3433a9c1f551c79e39280' });

var getRecentTagMedia = function getRecentTagMedia(tag, options) {
    console.log(tag);
    ig.tag_media_recent(tag, options, function(err, result, pagination, remaining, limit) {
        for(var i=0; i<result.length; i++) {
            var data = result[i]; 
            data['tag'] = tag;
            var media = new Media(data);
            media.save();
            saveMediaComments(data);
        }
        // if(pagination.next) {
        //     pagination.next(paginate); // Will get second page results 
        // }    
    });
}

/* ----------------- */
/* private functions */
/* ----------------- */

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