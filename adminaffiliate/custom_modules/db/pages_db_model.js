var Mongoose    = require('mongoose');

var pages_schema = new Mongoose.Schema({
  created:        {type: Date,    required: false, default: Date.now},
  name:           {type: String,  required: true },
  filepath:       {type: String,  required: false, default: ''},
  url:            {type: String,  required: false, default: ''}
});

exports.schema = pages_schema;

/*
var PagesModel = Mongoose.model("pages", pages_schema);

exports.get_model = function(){return PagesModel;};
*/