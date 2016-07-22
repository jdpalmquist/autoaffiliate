var Mongoose    = require('mongoose');

//SCHEMAS
//=======
var AdminHost   = require('./host_db_model'); 
var ErrorHost   = require('../error_db_model.js');
//=======
var Campaign    = require('../campaign_db_model');
var Lander      = require('../lander_db_model');
var Pages       = require('../pages_db_model');
var Offer       = require('../offer_db_model');
var Stats       = require('../stats_db_model');
var Traffic     = require('../trafficsrc_db_model');
var Leadgen     = require('../leadgen_db_model.js');
var Error       = require('../error_db_model.js');


console.log('TODO: DATABASE.JS --> clean up naming convention in the database file --> db.admin.host vs hosts, etc.');



//This is the actual exported object through which database access is made possible
var db = {
    admin:{
        host: null,
        error: null,
    },
    remote:[], 
    init: null,
    refresh: null,
};

var hosts = {
    admin: {
        conn: null,
    },
    remote: [
        /*
        {
            name:   '',
            ip:     '',
            port:   '',
            db:     '',
            user:   null,
            pass:   null,
            conn:   null
        }
        */
    ]
};


function initialize_local(){
    //setup the initial connection to the admin database,
    //  where the connection data for remote dbs are stored.
    //  Note: this is hardcoded to be on the local machine, admin affiliate is never meant to be publically available!
    //        only the ad-servers "auto affiliate" are intended to be published to the web, admin affiliate is the 
    //        control module.
    hosts = {
        admin:{
            conn:   Mongoose.createConnection('mongodb://127.0.0.1:27017/adminaffiliate')
        },
        remote:[]
    };

    //register the admin models so we can access those collections
    db.admin.host = hosts.admin.conn.model("host", AdminHost.schema);
    db.admin.error = hosts.admin.conn.model("error", ErrorHost.schema);
}


function initialize_remote(){
    //look up all the remote connections we will need
    db.admin.host.find({active:true}, function(err, h){
        if(err){
            //TODO: error...
            console.log('admin_db_init error: ', err);
        }
        else{
            //for each record, initialize a connection
            var name = null,
                ip = null,
                port = null,
                dbname = null,
                user = null,
                pass = null,
                conn = null;

            for(var i = 0; i < h.length; i++){
                //gather the record info
                name =      h[i].name;
                ip =        h[i].mongodb_host;
                port =      h[i].mongodb_port;
                dbname =    h[i].mongodb_dbname;
                user =      h[i].mongodb_user;
                pass =      h[i].mongodb_pass;
                conn =      null;

                if( ip != null && typeof ip != 'undefined' && ip != '' &&
                    port != null && typeof port != 'undefined' && port != '' &&
                    dbname != null && typeof dbname != 'undefined' && dbname != ''){
                    //use the record info to establish a remote connection to other mongodb instances
                    if( user != null && typeof user != 'undefined' && user != '' && 
                        pass != null && typeof pass != 'undefined' && pass != '' ){
                        conn = Mongoose.createConnection('mongodb://'+user+':'+pass+'@'+ip+':'+port+'/'+dbname);
                        console.log("Created a connection to " + 'mongodb://'+user+':'+pass+'@'+ip+':'+port+'/'+dbname);
                    }
                    else{
                        conn = Mongoose.createConnection('mongodb://'+ip+':'+port+'/'+dbname);
                        console.log("Created a connection to " + 'mongodb://'+ip+':'+port+'/'+dbname);
                    }

                    //save that connection to our transport array
                    hosts.remote.push({
                        name: name,
                        conn: conn
                    });                
                }
                else{
                    //Error! at minimum we need a ip && port && database name
                    console.log("Error: minimum requirement (ip, port num, and database-name) for a remote connection not found!");
                }
            }

            //now register each schema with each connection
            for(var i = 0; i < hosts.remote.length; i++){
                //make sure the connection is valid
                if(hosts.remote[i].conn != null && typeof hosts.remote[i].conn != 'undefined'){
                    db.remote[hosts.remote[i].name] = {
                        campaign:   hosts.remote[i].conn.model("campaign",      Campaign.schema),
                        offer:      hosts.remote[i].conn.model("offer",         Offer.schema),
                        lander:     hosts.remote[i].conn.model("lander",        Lander.schema),
                        pages:      hosts.remote[i].conn.model("pages",         Pages.schema),
                        stats:      hosts.remote[i].conn.model("stats",         Stats.schema),
                        trafficsrc: hosts.remote[i].conn.model("trafficsrc",    Traffic.schema),
                        leadgen:    hosts.remote[i].conn.model("leadgen",       Leadgen.schema),
                        error:      hosts.remote[i].conn.model("error",         Error.schema)
                    };        
                }
            }

        }
    });
}


function initialize(){
    initialize_local();
    initialize_remote();
}


function close_all_remote_connections(){
    for(var i = 0; i < hosts.remote.length; i++){
        hosts.remote[i].conn.close();
    }
}


function refresh(){
    //refresh the remote connections
    close_all_remote_connections();
    initialize_remote();
}


db.init = initialize;
db.refresh = refresh;


module.exports = db;