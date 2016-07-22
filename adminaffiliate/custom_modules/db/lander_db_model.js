var Mongoose    = require('mongoose');

var lander_schema = new Mongoose.Schema({
  created:        {type: Date,    required: false, default: Date.now},
  name:           {type: String,  required: false, default: '', unique: true},
  status:         {type: String,  required: false, default: 'active'},
  group:          {type: String,  required: false, default: ''},
  type:           {type: String,  required: false, default: ''},
  is_mobile:      {type: Boolean, required: false, default: false},
  is_tablet:      {type: Boolean, required: false, default: false},
  is_desktop:     {type: Boolean, required: false, default: false},
  filepath:       {type: String,  required: false, default: ''},
  tags:           {type: String,  required: false, default: ''},
  url:            {type: String,  required: false, default: ''},
});
/*
  campaigns:      [{type: Mongoose.Schema.Types.ObjectId, ref: 'campaign'}],

var LanderModel = Mongoose.model("lander", lander_schema);
exports.get_model = function(){return LanderModel;};
*/

exports.schema = lander_schema;