var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  id: { type : Number, unique : true },
  created_at: { type : String },
  entities: {
    hashtags: [
      {
        text: { type : String},
        indices: [
          { type : Number}
        ]
      }
    ]
  },
  text: { type : String, trim : true},
  retweet_count : { type: Number },
  q : { type : String}  // original query used to find this tweet
})

mongoose.model('Tweet', tweetSchema);