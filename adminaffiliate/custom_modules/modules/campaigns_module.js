var Fs 				= require('fs');
var db              = require('../db/admin/database');
var Url 			= require('url');
var Moment 			= require('moment');


function create_campaign(req, res){
    var server = req.params.host;
    var params = req.body;

    if(params.name != '' && params.slug != ''){
        var c = {
            name: params.name,
            slug: params.slug,
            type: params.type,
            group: params.group,
            is_mobile: params.is_mobile,
            is_desktop: params.is_desktop
        };

        db.remote[server].campaign.create(c, function(err, campaign){
            if(err){
                console.log('ERROR: CAMPAIGNS MODULE --> create_campaign() --> err: ', err);
                res.send({response: "failed"});
            }else{
                res.send({
                    response: "success",
                    data: campaign
                });
            }
        });
    }
}

function get_all_campaigns(req, res){
    var host = req.params.host;
    db.remote[host].campaign.find({}, function(err, campaigns){
        if(err){
            console.log('ERROR: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({response: "success", data: campaigns});
        }
    });
}

function get_all_active_campaigns(req, res){
	var host = req.params.host;
	//console.log("CAMPAIGNS MODULE --> get_all_active_campaigns() -->, db.remote: ", db.remote);
	db.remote[host].campaign.find({active:true}, function(err, campaigns){
		if(err){
			//console.log('ERROR: campaigns_module --> get_all_active_campaigns()');
			db.error.create({file:'campaigns_module.js', func:'get_all_active_campaigns', err:err},function(a,b,c){});
			res.type('application/json');
			res.send({response: 'error'});
		}
		else{

			//console.log('CAMPAIGNS MODULE --> get_all_active_campaigns() --> campaigns: ', campaigns);

			var h = null;
			var r = {"data":[]};
			for(var i = 0; i < campaigns.length; i++){
				h = '';
				h += '<a href="#/'+host+'/campaign/'+campaigns[i].name+'" class="capitalize">';
					h += campaigns[i].name;
				h += '</a>';
				h += ' ';
				h += '<a href="#/'+host+'/campaign/'+campaigns[i].name+'" class="btn btn-sm btn-primary float-right">';
					h += '<i class="fa fa-eye"></i>';
				h += '</a>';

				r.data.push([h]);
			}
			res.type('application/json');
			res.send(r);
		}
	});
}

function get_all_paused_campaigns(req, res){
    var host = req.params.host;
    //console.log("CAMPAIGNS MODULE --> get_all_active_campaigns() -->, db.remote: ", db.remote);
    db.remote[host].campaign.find({active:false}, function(err, campaigns){
        if(err){
            //console.log('ERROR: campaigns_module --> get_all_active_campaigns()');
            db.error.create({file:'campaigns_module.js', func:'get_all_active_campaigns', err:err},function(a,b,c){});
            res.type('application/json');
            res.send({response: 'error'});
        }
        else{

            //console.log('CAMPAIGNS MODULE --> get_all_active_campaigns() --> campaigns: ', campaigns);

            var h = null;
            var r = {"data":[]};
            for(var i = 0; i < campaigns.length; i++){
                h = '';
                h += '<a href="#/'+host+'/campaign/'+campaigns[i].name+'" class="capitalize">';
                    h += campaigns[i].name;
                h += '</a>';
                h += ' ';
                h += '<a href="#/'+host+'/campaign/'+campaigns[i].name+'" class="btn btn-sm btn-primary float-right">';
                    h += '<i class="fa fa-eye"></i>';
                h += '</a>';

                r.data.push([h]);
            }
            res.type('application/json');
            res.send(r);
        }
    });
}

function get_campaign(req, res){
	var host = req.params.host;
	var name = req.params.name;
	/*
	*/
	db.remote[host].campaign
	.findOne({name: name})
	.populate('active_landers')
	.populate('offer')
    .populate('traffic_src')
	.exec(function(err, campaign){
		if(err){
			//console.log('ERROR: campaigns_module --> get_all_active_campaigns()');
			db.error.create({file:'campaigns_module.js', func:'edit_campaign', err:err},function(a,b,c){});
			res.type('application/json');
			res.send({response: 'error'});
		}
		else{

			//replace the JS date in the document with a Moment date
			//campaign.createdAt = Moment(campaign.createdAt).format('dddd MMMM Do, YYYY @ h:mm:ss a');
			res.type('application/json');
			res.send(campaign);
		}
	});
}

function update_meta(req, res){
    var server = req.params.host;
    var campaign = req.params.name;
    var params = req.body;
    
    var conditions = {
        name: campaign
    };
    var updates = {
        slug: params.slug,
        type: params.type,
        group: params.group,
        is_mobile: params.is_mobile,
        is_desktop: params.is_desktop,
        phase: params.phase,
        phase_interval: params.phase_interval
    };
    var options = {};

    db.remote[server].campaign.update(conditions,updates,options, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> update_meta() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            if(result.n >= 1 && result.nModified >= 1){
                res.send({response: "success"});                
            }
            else{
                res.send({response: "no change"});
            }
        }
    });    
}

function set_offer(req, res){
    var server = req.params.host;
    var campaign = req.params.name;
    var params = req.body;
    var offer_id = params.offer_id;

    var conditions = {
        name: campaign
    };
    var updates = {
        offer: offer_id
    };
    var options = {};

    db.remote[server].campaign.update(conditions,updates,options, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> set_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            db.remote[server].offer.findOne({_id: offer_id}, function(err, offer){
                if(err){
                    console.log('ERROR: CAMPAIGNS MODULE --> set_offer() --> err: ', err);
                    res.send({response: "failed"});
                }
                else{
                    res.send({response: "success", data: offer});
                }
            });
        }
    });
}

function set_trafficsrc(req, res){
    var server = req.params.host;
    var name = req.params.name;

    var params = req.body;

    var conditions = {
        name: name
    };

    var updates = {
        traffic_src: params.trafficsrc_id
    };

    db.remote[server].campaign.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> set_trafficsrc() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            db.remote[server].trafficsrc.findOne({_id: params.trafficsrc_id}, function(err, trafficsrc){
                if(err){
                    console.log('ERROR: CAMPAIGNS MODULE --> set_trafficsrc() --> trafficsrc.find() --> err: ', err);
                    res.send({response: "failed"});
                }   
                else{
                    res.send({
                        response: "success",
                        data: trafficsrc
                    });                    
                }
            });
        }
    });
}

function add_lander(req, res){
    var server = req.params.host;
    var campaign = req.params.name;
    var params = req.body;

    var conditions = {
        name: campaign
    };
    var updates = {
        $push:{
            active_landers: params.lander_id
        }
    };
    var options = {};

    db.remote[server].campaign.update(conditions, updates, options, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> err: ', err);
            res.send({
                response: "failed"
            });
        }
        else{
            if(result.nModified >= 1 && result.n >= 1){
                res.send({
                    response: "success"
                });
            }
            else{
                res.send({
                    response: "failed"
                });
            }
        }
    });
}

function delete_lander(req, res){
    var server = req.params.host;
    var name = req.params.name;
    var lander_id = req.params.landerid;
    var conditions = {
        name: name
    };
    var updates = {
        $pull: {
            active_landers: lander_id
        }
    };

    //Note: mysterious bug has been solved, Mongodb doesn't support single entry removal from arrays yet.
    console.log('ERROR: CAMPAIGNS MODULE --> delete_lander() -->  There is a mysterious bug centered around this functionality that causes the system to overwrite the adjacent record? dafuq?');


    db.remote[server].campaign.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> delete_lander() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({response: "success"});
        }
    });
}

function get_lander_pool(req, res){
    var server = req.params.host;
    var campaign = req.params.name;
    var params = req.body;

    var conditions = {
        name: campaign
    };
    var options = {active_landers: 1, paused_landers: 1};

    db.remote[server].campaign.findOne(conditions, options, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> get_lander_pool() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            var data = {
                landers: []
            };

            data.landers.concat(result.active_landers);
            data.landers.concat(result.paused_landers);

            res.send({
                response: "success",
                data: data
            });
        }
    });
}

function get_active_lander_pool(req, res){
    var server = req.params.host;
    var campaign = req.params.name;
    var params = req.body;

    var conditions = {
        name: campaign
    };
    var options = {active_landers: 1};

    db.remote[server].campaign.findOne(conditions, options, function(err, campaign){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> get_lander_pool() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            if(campaign != null && typeof campaign.active_landers != 'undefined' && campaign.active_landers != null){
                var data = {
                    landers: campaign.active_landers
                };

                res.send({
                    response: "success",
                    data: data
                });
            }
        }
    });
}

function get_paused_lander_pool(req, res){

}

function delete_campaign(req, res){
    var server = req.params.host;
    var campaign = req.params.name;
    
    var conditions = {
        name: campaign
    };
    
    db.remote[server].campaign.remove(conditions, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> delete_campaign() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            /*
                console.log('DEBUG: CAMPAIGNS MODULE --> delete_campaign() --> result: ', result);
                result:  { result: { ok: 1, n: 1 },
            */
            if(result.result.n >= 1 && result.result.ok == 1){
                res.send({
                    response: "success",
                });                
            }
            else{
                res.send({
                    response: "no change",
                });
            }
        }
    });
}

function is_active(req, res){
    var server = req.params.host;
    var campaign_name = req.params.name;

    db.remote[server].campaign.findOne({name: campaign_name}, function(err, campaign){
        if(err){
            console.log('ERROR: CAMPAIGN MODULE --> is_active() --> err: ', err);
            res.send({
                response: "failed"
            });
        }
        else{
            res.send({
                response: "success",
                data: campaign.active
            });
        }
    });
}

function activate_campaign(req, res){
    var server = req.params.host;
    var campaign_name = req.params.name;

    var conditions = {
        name: campaign_name
    };
    var updates = {
        active: true
    };

    db.remote[server].campaign.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGN MODULE --> is_active() --> err: ', err);
            res.send({
                response: "failed"
            });
        }
        else{
            res.send({
                response: "success",
                data: result
            });
        }
    });
}

function pause_campaign(req, res){
    var server = req.params.host;
    var campaign_name = req.params.name;

    var conditions = {
        name: campaign_name
    };
    var updates = {
        active: false
    };

    db.remote[server].campaign.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: CAMPAIGN MODULE --> is_active() --> err: ', err);
            res.send({
                response: "failed"
            });
        }
        else{
            res.send({
                response: "success",
                data: result
            });
        }
    });
}

function get_setup_status(req, res){
    var server = req.params.host;
    var campaign_name = req.params.name;
    
    db.remote[server].campaign.find({name: campaign_name}, function(err, campaign){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> get_setup_status() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            var data = {};
            if(campaign != null && campaign != '' && typeof campaign != 'undefined'){
                //has offer?
                if(typeof campaign.offer != 'undefined' && campaign.offer != '' && campaign.offer != null){
                    data['has_offer'] = true;
                }
                else{
                    data['has_offer'] = false;
                }

                //has at least one lander?
                if(typeof campaign.active_landers != 'undefined' && campaign.active_landers != null && campaign.active_landers.length >= 1){
                    data['has_landers'] = true;
                }
                else{
                    data['has_landers'] = false;
                }

                //has traffic source?
                if(typeof campaign.traffic_src != 'undefined' && campaign.traffic_src != null && campaign.traffic_src != ''){
                    data['has_trafficsrc'] = true;
                }
                else{
                    data['has_trafficsrc'] = false;
                }

                res.send({
                    response: "success",
                    data: data
                });
            }
            else{
                res.send({response: "failed"});
            }
        }
    });
}

module.exports = {
    create_campaign: create_campaign,
    get_all_campaigns: get_all_campaigns,
    get_all_active_campaigns: get_all_active_campaigns,
    get_all_paused_campaigns: get_all_paused_campaigns,
    get_campaign: get_campaign,
    update_meta: update_meta,
    delete_campaign: delete_campaign,
    set_offer: set_offer,
    set_trafficsrc: set_trafficsrc,
    add_lander: add_lander,
    delete_lander: delete_lander,
    get_lander_pool: get_lander_pool,
    get_active_lander_pool: get_active_lander_pool,
    get_paused_lander_pool: get_paused_lander_pool,
    is_active: is_active,
    activate_campaign: activate_campaign,
    pause_campaign: pause_campaign,
    get_setup_status: get_setup_status,
};