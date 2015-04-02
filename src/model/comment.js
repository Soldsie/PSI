var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  id: { type: String },
  text: { type : String, default : '', trim : true },
  created_time: { type: String },
  media_id: { type : String}
});

mongoose.model('Comment', commentSchema);