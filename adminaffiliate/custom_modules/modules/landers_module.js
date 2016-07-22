var Fs              = require('fs');
var db              = require('../db/admin/database');
var Url             = require('url');


function get_all_landers_json(req, res){
    var host = req.params.host;
    //console.log("LANDERS MODULE --> get_all_active_landers() -->, db.remote: ", db.remote);
    db.remote[host].lander.find({}, function(err, landers){
        if(err){
            console.log('ERROR: LANDERS MODULE --> get_all_active_landers()');
            db.error.create({file:'landers_module.js', func:'get_all_active_landers', err:err},function(a,b,c){});
            res.type('application/json');
            res.send({response: 'error'});
        }
        else{

            //console.log('LANDERS MODULE --> get_all_active_landers() --> landers: ', landers);

            res.type('application/json');
            res.send({response:"success", data: landers});
        }
    });
}

function get_all_landers(req, res){
    var host = req.params.host;
    var campaign_name = req.params.name;

    //console.log("LANDERS MODULE --> get_all_active_landers() -->, db.remote: ", db.remote);
    db.remote[host].lander.find({}, function(err, landers){
        if(err){
            console.log('ERROR: LANDERS MODULE --> get_all_active_landers()');
            db.error.create({file:'landers_module.js', func:'get_all_active_landers', err:err},function(a,b,c){});
            res.type('application/json');
            res.send({response: 'error'});
        }
        else{

            //console.log('LANDERS MODULE --> get_all_active_landers() --> landers: ', landers);

            var r = {
                response: "success",
                data:[]
            };
            for(var i = 0; i < landers.length; i++){
                r.data.push({
                    lander_id:          landers[i]._id,
                    lander_name:        landers[i].name,
                    lander_filepath:    landers[i].filepath,
                    lander_url:         landers[i].url,
                    lander_type:        landers[i].type,
                    lander_group:       landers[i].group,
                    lander_ismobile:    landers[i].is_mobile,
                    lander_istablet:    landers[i].is_tablet,
                    lander_isdesktop:   landers[i].is_desktop,
                    lander_tags:        landers[i].tags
                });
            }
            res.type('application/json');
            res.send(r);
        }
    });
}

function create_lander(req, res){
    var host = req.params.host;
    var params = req.body;

    if(params.lander_name != '' && params.lander_name != null){
        var lander = {
            name:           params.lander_name,
            status:         'active',
            group:          params.lander_group,
            type:           params.lander_type,
            is_mobile:      params.lander_ismobile,
            is_tablet:      params.lander_istablet,
            is_desktop:     params.lander_isdesktop,
            filepath:       params.lander_filepath,
            tags:           params.lander_tags,
            url:            params.lander_url
        };
        db.remote[host].lander.create(lander, function(err, result){
            if(err){
                console.log('ERROR: ', err);
                res.send({response: "failed"});
            }
            else{
                if(typeof result != 'undefined' && result != null)
                    res.send({response: "success"});
                else
                    res.send({response: "failed"});
            }
        });
    }
}

function get_lander(req, res){
    var server = req.params.host;
    var lander_id = req.params.landerid; 

    var conditions = {
        _id: lander_id
    };
    
    db.admin.host.findOne({name: server}, function(err, host){
        if(err){
            console.log('ERROR: CAMPAIGNS MODULE --> err: ', err);
            res.send({
                response: "failed"
            });
        }
        else{
            db.remote[server].lander.findOne(conditions, function(err, lander){
                if(err){
                    console.log('ERROR: CAMPAIGNS MODULE --> err: ', err);
                    res.send({
                        response: "failed"
                    });
                }
                else{
                    if(lander && typeof lander.url != 'undefined'){
                        lander.url = 'http://' + host.hosting_ip + lander.url;
                    }
                    console.log('DEBUG: CAMPAIGNS MODULE --> get_lander() --> result: ', lander);
                    res.send({
                        response: "success",
                        data: lander
                    });
                }
            });
        }
    });

}

function update_lander(req, res){

}

function delete_lander(req, res){
    var host = req.params.host;
    var params = req.body;

    if(typeof params.lander_id != 'undefined' && params.lander_id != null && params.lander_id != ''){
        db.remote[host].lander.remove({_id: params.lander_id}, function(err, a,b,c){
            if(err){
                console.log('ERROR: ' + err);
                res.send({response: "failed"});
            }
            else{
                res.send({response: "success"});
            }
        });
    }
    else{
        res.send({response: "failed"});
    }
}

module.exports = {
    get_all_landers_json: get_all_landers_json,
    get_all_landers: get_all_landers,
    get_lander: get_lander,
    create_lander: create_lander,
    update_lander: update_lander,
    delete_lander: delete_lander
};