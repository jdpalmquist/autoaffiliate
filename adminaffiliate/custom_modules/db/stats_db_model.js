var Mongoose    = require('mongoose');

/*
var Campaign    = require('./campaign_db_model');
var Lander      = require('./lander_db_model');
var Offer       = require('./offer_db_model');
var TrafficSrc  = require('./trafficsrc_db_model');
var stats       = require('./stats_db_model');
*/
var stats_schema = new Mongoose.Schema({
  created: 	  	{type: Date,    required: false, default: Date.now},
  _campaign:  	{type: Mongoose.Schema.Types.ObjectId, ref: 'campaign'},
  _lander:    	{type: Mongoose.Schema.Types.ObjectId, ref: 'lander'},
  _offer:     	{type: Mongoose.Schema.Types.ObjectId, ref: 'offer'},
  group:      	{type: String,  required: false, default: ''},
  type:       	{type: String,  required: false, default: ''},
  ip: 		  	{type: String, 	required: false, default: ''},
  url: 			{type: String, 	required: false, default: ''},
  ua: 			{type: String, 	required: false, default: ''},
});
/*
var StatsModel = Mongoose.model("stats", stats_schema);

exports.get_model = function(){return StatsModel;};
*/
exports.schema = stats_schema;