var Mongoose    = require('mongoose');

var Campaign    = require('./campaign_db_model');
var Lander      = require('./lander_db_model');
var Offer       = require('./offer_db_model');
/*
var TrafficSrc  = require('./trafficsrc_db_model');
var stats       = require('./stats_db_model');
*/
//note: these documents should automatically expire after 48 hours in the database
var leadgen_schema = new Mongoose.Schema({
  created: 	  	{type: Date,    required: false, default: Date.now, expires: 172800},
  _campaign:  	{type: Mongoose.Schema.Types.ObjectId, ref: 'campaign'},
  _lander:    	{type: Mongoose.Schema.Types.ObjectId, ref: 'lander'},
  _offer:     	{type: Mongoose.Schema.Types.ObjectId, ref: 'offer'},
  group:      	{type: String,  required: false, default: ''},
  nonce:       	{type: String,  required: false, default: ''},
});
var LeadgenModel = Mongoose.model("leadgens", leadgen_schema);

exports.get_model = function(){return LeadgenModel;};