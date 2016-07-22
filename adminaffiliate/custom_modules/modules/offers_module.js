var Fs              = require('fs');
var db              = require('../db/admin/database');
var Url             = require('url');


function get_all_offers_json(req, res){
    var host = req.params.host;
    //console.log("OFFERS MODULE --> get_all_active_offers() -->, db.remote: ", db.remote);
    db.remote[host].offer.find({}, function(err, offers){
        if(err){
            //console.log('ERROR: OFFERS MODULE --> get_all_active_offers()');
            db.error.create({file:'offers_module.js', func:'get_all_active_offers', err:err},function(a,b,c){});
            res.send({response: 'failed'});
        }
        else{
            res.send({response:"success", data: offers});
        }
    });
}

function create_offer(req, res){
    var host = req.params.host;
    var offer = req.body;

    db.remote[host].offer.create(offer, function(err, result){
        if(err){
            console.log('ERROR: OFFERS MODULE --> create_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            //console.log('DEBUG: OFFERS MODULE --> create_offer() --> result: ', result);
            res.send({response: "success"});
        }
    });
}

function get_offer(req, res){
    var server = req.params.host;
    var offerid = req.params.offerid;

    db.remote[server].offer.findOne({_id: offerid}, function(err, offer){
        if(err){
            console.log('ERROR: OFFERS MODULE --> get_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            //console.log('DEBUG: OFFERS MODULE --> get_offer() --> offer: ', offer);
            res.send({
                response: "success",
                data: offer
            });
        }
    });
}

function update_offer(req, res){
    var server = req.params.host;
    var offerid = req.params.offerid;
    var params = req.body;

    var conditions = {
        _id: offerid
    };

    var updates = {};

    if(params.name != '' && params.name != null && typeof params.name != 'undefined'){
        updates['name'] = params.name;
    }

    if(params.type != '' && params.type != null && typeof params.type != 'undefined'){
        updates['type'] = params.type;
    }
    
    if(params.group != '' && params.group != null && typeof params.group != 'undefined'){
        updates['group'] = params.group;
    }

    if(params.redirect_url != '' && params.redirect_url != null && typeof params.redirect_url != 'undefined'){
        updates['redirect_url'] = params.redirect_url;
    }

    if(params.callback_var != '' && params.callback_var != null && typeof params.callback_var != 'undefined'){
        updates['callback_var'] = params.callback_var;
    }

    if(params.epa != '' && params.epa != null && typeof params.epa != 'undefined'){
        updates['epa'] = params.epa;
    }

    if(params.is_mobile != null && typeof params.is_mobile != 'undefined'){
        updates['is_mobile'] = params.is_mobile;
    }

    if(params.is_desktop != null && typeof params.is_desktop != 'undefined'){
        updates['is_desktop'] = params.is_desktop;
    }    

    db.remote[server].offer.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: OFFERS MODULE --> update_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            //console.log('DEBUG: OFFERS_MODULE --> update_offer() --> result: ', result);
            if(result.n >= 1 && result.nModified >= 1){
                res.send({
                    response: "success"
                });
            }
            else{
                res.send({
                    response: "no change"
                });
            }
        }
    });
}

function delete_offer(req, res){
    var server = req.params.host;
    var offerid = req.params.offerid;

    db.remote[server].offer.remove({_id: offerid}, function(err, result){
        if(err){
            console.log('ERROR: OFFERS MODULE --> delete_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: result
            });
        }
    });
}

function is_active(req, res){
    var server = req.params.host;
    var offerid = req.params.offerid;

    db.remote[server].offer.find({_id: offerid}, function(err, offer){
        if(err){
            console.log('ERROR: OFFERS MODULE --> is_active() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: offer.active
            });
        }
    });
}

function activate_offer(req, res){
    var server = req.params.host;
    var offerid = req.params.offerid;

    var conditions = {
        _id: offerid
    };

    var updates = {
        active: true
    };

    db.remote[server].offer.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: OFFERS MODULE --> activate_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: result
            });
        }
    });
}

function pause_offer(req, res){
    var server = req.params.host;
    var offerid = req.params.offerid;

    var conditions = {
        _id: offerid
    };

    var updates = {
        active: false
    };

    db.remote[server].offer.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: OFFERS MODULE --> pause_offer() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: result
            });
        }
    });
}

module.exports = {
    get_all_offers_json: get_all_offers_json,
    create_offer: create_offer,
    get_offer: get_offer,
    update_offer: update_offer,
    delete_offer: delete_offer,
    is_active: is_active,
    activate_offer: activate_offer,
    pause_offer: pause_offer
};