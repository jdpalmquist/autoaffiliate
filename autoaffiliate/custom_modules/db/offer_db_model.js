var Mongoose    = require('mongoose');

var Campaign    = require('./campaign_db_model');
/*
var Lander      = require('./lander_db_model');
var Offer       = require('./offer_db_model');
var TrafficSrc  = require('./trafficsrc_db_model');
var stats       = require('./stats_db_model');
*/
var offer_schema = new Mongoose.Schema({
  created:        {type: Date,    required: false, default: Date.now},
  name:           {type: String,  required: true },
  active:         {type: Boolean, required: false, default: true},
  type:           {type: String,  required: false, default: ''},
  group:          {type: String,  required: false, default: ''},
  redirect_url:   {type: String,  required: true},
  callback_var:   {type: String,  required: true},
  is_mobile:      {type: Boolean, required: false, default: false},
  is_desktop:     {type: Boolean, required: false, default: false},
  epa:            {type: Number,  required: false, default: 0},
  daily_max:      {type: Number,  required: false, default: 0},
  weekly_max:     {type: Number,  required: false, default: 0},
  monthly_max:    {type: Number,  required: false, default: 0}
});
var OfferModel = Mongoose.model("offer", offer_schema);

exports.get_model = function(){return OfferModel;};