var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
  id: { type : String },
  link: { type : String},
  type: { type : String, default : '', trim : true},
  caption: {
    text: { type : String, default : '', trim : true }
  },
  created_time: { type : String},
  comments: {
    data :[{
      id: { type : String},
      created_time: { type : String },
      text: { type : String, default: ''}
    }],
    count: { type : String} 
  },
  likes: {
    count: { type : String }
  },
  tag : { type : String },
  tags: [
    { type : String }
  ],
  images: {
    standard_resolution: {
      url: { type : String},
    }
  }
});

mongoose.model('Media', mediaSchema);