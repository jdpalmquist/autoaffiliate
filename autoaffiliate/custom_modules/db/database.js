//single source of truth: mongo instance
var Mongoose        = require('mongoose');

//load the schemas
var TrafficSrcModel 	= require('./trafficsrc_db_model');
var CampaignModel 		= require('./campaign_db_model');
var LeadgenModel 		= require('./leadgen_db_model');
var LanderModel 		= require('./lander_db_model');
var OfferModel 			= require('./offer_db_model');
var PagesModel          = require('./pages_db_model');
var StatsModel 			= require('./stats_db_model');
var VisitModel 			= require('./visit_db_model');
var ErrorModel          = require('./error_db_model');

//create the encapsulation object
var db = {
	trafficsrc: TrafficSrcModel.get_model(),
	campaign: CampaignModel.get_model(),
	leadgen: LeadgenModel.get_model(),
	lander: LanderModel.get_model(),
	offer: OfferModel.get_model(),
    pages: PagesModel.get_model(),
	stats: StatsModel.get_model(),
	visit: VisitModel.get_model(),
    error: ErrorModel.get_model()
};

module.exports = db;