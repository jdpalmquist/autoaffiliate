var Fs              = require('fs');
var db              = require('../db/admin/database');


function get_traffic_sources(req, res){
    var server = req.params.host;

    db.remote[server].trafficsrc.find({}, function(err, trafficsrcs){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> get_traffic_sources() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: trafficsrcs
            });
        }
    });
}

function get_traffic_source(req, res){
    var server = req.params.host;
    var trafficsrcid = req.params.trafficsrcid;

    db.remote[server].trafficsrc.findOne({_id: trafficsrcid}, function(err, trafficsrc){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> get_traffic_source() --> err: ', err);
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

function get_active_traffic_sources(req, res){
    var server = req.params.host;

    db.remote[server].trafficsrc.find({active: true}, function(err, trafficsrcs){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> get_active_traffic_sources() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: trafficsrcs
            });
        }
    });
}

function get_paused_traffic_sources(req, res){
    var server = req.params.host;

    db.remote[server].trafficsrc.find({active: false}, function(err, trafficsrcs){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> get_paused_traffic_sources() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: trafficsrcs
            });
        }
    });
}

function create_traffic_source(req, res){
    var server = req.params.host;
    var params = req.body;

    /*
        created:        {type: Date,    required: false, default: Date.now},
        login_url:      {type: String,  required: false, default: ''},
        login_username: {type: String,  required: false, defualt: ''},
        login_password: {type: String,  required: false, default: ''},
        name:           {type: String,  required: false, default: ''},
        type:           {type: String,  required: false, default: ''},
        ad_type:        {type: String,  required: false, default: ''},
        ad_img:         {type: String,  required: false, default: ''},
        is_cpc:         {type: Boolean, required: false, default: false},
        is_cpm:         {type: Boolean, required: false, default: false},
        cpa:            {type: Number,  required: false, default: 0},
        inbound_clicks: {type: Number,  required: false, default: 0},
    */

    var t = {
        name:               params.name,
        type:               params.type,
        login_url:          params.login_url,
        login_username:     params.login_username,
        login_password:     params.login_password,
        ad_type:            params.ad_type,
        ad_img:             params.ad_img,
        is_cpc:             params.is_cpc,
        is_cpm:             params.is_cpm,
        cpa:                params.cpa,
    };

    db.remote[server].trafficsrc.create(t, function(err, result){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> create_traffic_source() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success"
            });
        }
    });
}

function update_traffic_source(req, res){
    var server = req.params.host;
    var trafficsrcid = req.params.trafficsrcid;
    var params = req.body;

    var conditions = {
        _id: trafficsrcid
    };

    var updates = {
        name: params.name,
        type: params.type,
        group: params.group,
        active: params.active,
        is_cpc: params.is_cpc,
        is_cpm: params.is_cpm,
        cpa: params.cpa,
        ad_type: params.adtype,
        ad_img: params.adimg,
        login_url: params.login_url,
        login_username: params.login_username,
        login_password: params.login_password
    };

    db.remote[server].trafficsrc.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: TRAFFICE SOURCE MODULE --> update_traffic_source() --> err: ', err);
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

function delete_traffic_source(req, res){
    var server = req.params.host;
    var tid = req.params.trafficsrcid;

    var conditions = {
        _id: tid
    };

    db.remote[server].trafficsrc.remove(conditions, function(err, result){
        if(err){
            console.log('ERROR TRAFFIC SOURCE MODULE --> delete_traffic_source() --> err: ', err);
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

function is_active(req, res){
    var server = req.params.host;
    var tid = req.params.tid;

    db.remote[server].find({_id: tid}, function(err, t){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> is_active() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({
                response: "success",
                data: t.active
            });
        }
    });
}

function activate_traffic_source(req, res){
    var server = req.params.host;
    var tid = req.params.tid;

    var conditions = {
        _id: tid
    };

    var updates = {
        active: true
    };

    db.remote[server].trafficsrc.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> activate_traffic_source() --> err: ', err);
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

function pause_traffic_source(req, res){
    var server = req.params.host;
    var tid = req.params.tid;

    var conditions = {
        _id: tid
    };

    var updates = {
        active: false
    };

    db.remote[server].trafficsrc.update(conditions, updates, function(err, result){
        if(err){
            console.log('ERROR: TRAFFIC SOURCE MODULE --> pause_traffic_source() --> err: ', err);
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
    get_traffic_sources: get_traffic_sources,
    get_traffic_source: get_traffic_source,
    get_active_traffic_sources: get_active_traffic_sources,
    get_paused_traffic_sources: get_paused_traffic_sources,
    create_traffic_source: create_traffic_source,
    update_traffic_source: update_traffic_source,
    delete_traffic_source: delete_traffic_source,
    is_active: is_active,
    activate_traffic_source: activate_traffic_source,
    pause_traffic_source: pause_traffic_source
};