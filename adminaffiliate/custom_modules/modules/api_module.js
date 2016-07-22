var db = require('../db/admin/database');


function get_all_servers(req, res){
    db.admin.host.find({active:true}, function(err, servers){
        if(err){
            db.admin.error.create({file:'api_module.js', func:'get_all_hosts', err: err}, function(a,b,c){});
            res.type('application/json');
            res.send({response:'error'});
        }
        else{
            res.type('application/json');    
            res.send(servers);
        }    
    });
}

function get_server(req, res){
    var host = req.params.host;
    db.admin.host.findOne({name: host}, function(err, host){
        if(err){
            console.log('ERROR: ', err);
            res.send({response: "failed"});
        }
        else{
            res.send({response: "success", data: host});
        }
    });
}

function add_server(req, res){
    var params = req.body;
    //console.log('API MODULE --> add_host() --> params: ', params);    
    var newHost = {
        name:           params.name,
        group:          params.group,
        type:           params.type,
        full_domain:    params.full_domain,
        registrar_url:  params.registrar_url,
        registrar_user: params.registrar_user,
        registrar_pass: params.registrar_pass,
        hosting_url:    params.hosting_url,
        hosting_user:   params.hosting_user,
        hosting_pass:   params.hosting_pass,
        hosting_ip:     params.hosting_ip,
        hosting_port:   params.hosting_port,
        mongodb_connstr:params.mongodb_connstr,
        mongodb_user:   params.mongodb_user,
        mongodb_pass:   params.mongodb_pass,
        mongodb_host:   params.mongodb_host,
        mongodb_port:   params.mongodb_port,
        mongodb_dbname: params.mongodb_dbname
    };
    db.admin.host.create(newHost, function(err,a,b,c){
        if(err){
            //console.log("add_host: error: ", err);
            db.admin.error.create({file:'api_module', func:'add_host', err:err}, function(err,a,b,c){});
            res.type('application/json');
            res.send({response:'error'});
        }
        else{
            //console.log('API MODULE --> add_host() --> create --> result: ', {a:a, b:b, c:c});
            db.refresh();
            res.type('application/json');
            res.send({response:'success'});
        }
    });
}

function update_server(req, res){
    var params = req.body;
    
    var conditions = {},
        updates = {},
        options = {};

    if(typeof params.id != 'undefined' && params.id != null){
        conditions['_id'] = params.id;

        if(typeof params.name != 'undefined' && params.name != null){
            updates['name'] = params.name;
        }

        if(typeof params.type != 'undefined' && params.type != null){
            updates['type'] = params.type;
        }

        if(typeof params.group != 'undefined' && params.group != null){
            updates['group'] = params.group;
        }

        if(typeof params.full_domain != 'undefined' && params.full_domain != null){
            updates['full_domain'] = params.full_domain;
        }

        if(typeof params.registrar_url != 'undefined' && params.registrar_url != null){
            updates['registrar_url'] = params.registrar_url;
        }

        if(typeof params.registrar_user != 'undefined' && params.registrar_user != null){
            updates['registrar_user'] = params.registrar_user;
        }

        if(typeof params.registrar_pass != 'undefined' && params.registrar_pass != null){
            updates['registrar_pass'] = params.registrar_pass;
        }

        if(typeof params.hosting_url != 'undefined' && params.hosting_url != null){
            updates['hosting_url'] = params.hosting_url;
        }

        if(typeof params.hosting_user != 'undefined' && params.hosting_user != null){
            updates['hosting_user'] = params.hosting_user;
        }

        if(typeof params.hosting_pass != 'undefined' && params.hosting_pass != null){
            updates['hosting_pass'] = params.hosting_pass;
        }

        if(typeof params.hosting_ip != 'undefined' && params.hosting_ip != null){
            updates['hosting_ip'] = params.hosting_ip;
        }

        if(typeof params.hosting_port != 'undefined' && params.hosting_port != null){
            updates['hosting_port'] = params.hosting_port;
        }

        if(typeof params.mongodb_connstr != 'undefined' && params.mongodb_connstr != null){
            updates['mongodb_connstr'] = params.mongodb_connstr;
        }

        if(typeof params.mongodb_user != 'undefined' && params.mongodb_user != null){
            updates['mongodb_user'] = params.mongodb_user;
        }

        if(typeof params.mongodb_pass != 'undefined' && params.mongodb_pass != null){
            updates['mongodb_pass'] = params.mongodb_pass;
        }

        if(typeof params.mongodb_host != 'undefined' && params.mongodb_host != null){
            updates['mongodb_host'] = params.mongodb_host;
        }

        if(typeof params.mongodb_port != 'undefined' && params.mongodb_port != null){
            updates['mongodb_port'] = params.mongodb_port;
        }

        db.admin.host.update(conditions, updates, options, function(err, result){
            if(err){
                console.log('ERROR: ', err);
                res.send({'response': "failed"});
            }else{
                if((result.ok == 1 || result.ok == '1') && (parseInt(result.n) >= 1) && (parseInt(result.nModified) >= 1)){
                    res.send({'response': "success"});
                    db.refresh();
                }
                else{
                    res.send({'response': "no change"});
                }
            }
        });
    }else{
        res.send({'response': "missing server id"});   
    }
}

function delete_server(req, res){
    var params = req.body;
    if(params != {}){
        db.admin.host.remove({_id: params._id}, function(err, result){
            if(err){
                console.log('ERROR: ', err);
                res.send({response: "failed"});
            }
            db.refresh();
            res.send({response: "success"});
        });        
    }
    else{
        res.send({response: "failed"});
    }
}

function exchange_hostname_for_ip(req, res){
    var hostname = req.params.host;

    db.admin.host.findOne({name: hostname}, function(err, host){
        if(err){
            console.log('ERROR: API MODULE --> exchange_hostname_for_ip() --> err: ', err);
            res.send({response: "failed"});
        }
        else{
            if(host && host.hosting_ip){
                res.send({
                    response: "success",
                    data: host.hosting_ip
                });
            }
        }
    });
}

module.exports = {
    add_server: add_server,
    update_server: update_server,
    delete_server: delete_server,
    get_server: get_server,
    get_all_servers: get_all_servers,
    exchange_hostname_for_ip: exchange_hostname_for_ip
};