var Mongoose    = require('mongoose');

/*
var Campaign    = require('./campaign_db_model');
*/
var Lander      = require('./lander_db_model');
var Offer       = require('./offer_db_model');
var TrafficSrc  = require('./trafficsrc_db_model');
var stats       = require('./stats_db_model');

var campaign_schema = new Mongoose.Schema({
  name:           {type: String,  required: true },
  createdAt:      {type: Date,    required: false, default: Date.now},
  active:         {type: Boolean, required: false, default: true},
  group:          {type: String,  required: false, default: ''},
  type:           {type: String,  required: false, default: ''},
  is_mobile:      {type: Boolean, required: false, default: false},
  is_desktop:     {type: Boolean, required: false, default: false}, 
  slug:           {type: String,  required: false, default: '', unique: true},
  total_pv:       {type: Number,  required: false, default: 0},
  total_lg:       {type: Number,  required: false, default: 0},
  total_cv:       {type: Number,  required: false, default: 0},
  phase:          {type: Number,  required: false, default: 1},
  phase_interval: {type: Number,  required: false, default: 100000},  
  lander_index:   {type: Number,  required: false, default: 0},
  active_landers: [{type: Mongoose.Schema.Types.ObjectId, ref: 'lander'}],
  removed_landers:[{type: Mongoose.Schema.Types.ObjectId, ref: 'lander'}],  
  traffic_src:    {type: Mongoose.Schema.Types.ObjectId, ref: 'trafficsrc'},
  offer:          {type: Mongoose.Schema.Types.ObjectId, ref: 'offer'},
  stats:          [{type: Mongoose.Schema.Types.ObjectId, ref: 'stats'}],
});
var CampaignModel = Mongoose.model("campaign", campaign_schema);

exports.get_model = function(){return CampaignModel;};