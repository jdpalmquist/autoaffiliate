var Mongoose    = require('mongoose');

var visit_schema = new Mongoose.Schema({
  created:      {type: Date,    required: false, default: Date.now},
  ip: 			{type: String, 	required: true},
  url: 			{type: String, 	required: true},
  ua: 			{type: Object, 	required: true},
});
var VisitModel = Mongoose.model("visits", visit_schema);

exports.get_model = function(){return VisitModel;};