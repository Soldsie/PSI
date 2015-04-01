var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema = new Schema({
  id: { type: String },
  type: { type : String, default : '', trim : true},
  caption: {
    text: { type : String, default : '', trim : true }
  },
  created_time: { type : String},
  comments: [{
    id: { type : String},
    created_time: { type : String },
    text: { type : String, default: ''}
  }],
  likes: {
    count: { type : String }
  },
  tags: [
    { type : String }
  ],
  tag: { type: String },
  images: {
    standard_resolution: {
      url: { type : String},
    }
  }
});

mongoose.model('Media', MediaSchema);