var Mongoose    = require('mongoose');

/*
var Campaign    = require('./campaign_db_model');
var Lander      = require('./lander_db_model');
var Offer       = require('./offer_db_model');
var TrafficSrc  = require('./trafficsrc_db_model');
var stats       = require('./stats_db_model');
*/

var trafficsrc_schema = new Mongoose.Schema({
  created:        {type: Date,    required: false, default: Date.now},
  login_url:      {type: String,  required: false, default: ''},
  login_username: {type: String,  required: false, defualt: ''},
  login_password: {type: String,  required: false, default: ''},
  name:           {type: String,  required: false, default: ''},
  active:         {type: Boolean, required: false, default: true},
  type:           {type: String,  required: false, default: ''},
  group:          {type: String,  required: false, default: ''},
  ad_type:        {type: String,  required: false, default: ''},
  ad_img:         {type: String,  required: false, default: ''},
  is_cpc:         {type: Boolean, required: false, default: false},
  is_cpm:         {type: Boolean, required: false, default: false},
  cpa:            {type: Number,  required: false, default: 0},
  inbound_clicks: {type: Number,  required: false, default: 0},
});
/*
var TrafficSrcModel = Mongoose.model("trafficsrc", trafficsrc_schema);

exports.get_model = function(){return TrafficSrcModel;};
*/
exports.schema = trafficsrc_schema;