var Mongoose    = require('mongoose');

var error_schema = new Mongoose.Schema({
  created: 		{type: String, 	required: false, default: Date.now},
  file:         {type: String,  required: true},
  func:         {type: String,  required: true},
  err:          {type: Object,  required: true},
});
/*
var ErrorModel = Mongoose.model("error", error_schema);

exports.get_model = function(){return ErrorModel;};
*/

exports.schema = error_schema;