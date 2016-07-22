'use strict';

//nodemon:
//========
//  sudo nodemon -w /custom_modules -w /public -w /server.js -w /package.json -e js,html,css,png,jpg,json server.js


//initiate the admin server:
//==========================
var Express         = require('express');
var app             = require('express')();                         //express.js instance
var server          = require('http').Server(app);                  //httpServer object (required for socket.io)
var io              = require('socket.io')(server);                 //socket.io instance


//system properties:
//==================
app.set('app_name', 'adminaffiliate');                               //application name
app.set('secret_key', 'mkiuyyfdserfdserty7654efrtyujiuiuytrfgyg');  //secret session key, shhhhh
app.set('root_dir', process.env.APP_DIR);                           //root file directory
app.set('public_port', process.env.PORT || 8080);                   //Public port # (note: 80 for http, 443 for https)
app.set('track_visitors', true);                                    //diasbles/enables default raw tracking
app.set('app_mode', 'dev');                                         //domain switching
app.set('domain', 'localhost');                                     //domain defaults to dev: localhost
if(app.get('app_mode') == 'pro') 
  app.set('domain', 'example.production.com');                      //set the production domain here
app.set('app_cookie_name', app.get('app_name'));                    //app cookie name


//load npm modules:
//=================
var ExpressUA       = require('express-useragent');
var ExpressSession  = require('express-session');
var CookieParser    = require('cookie-parser');
var BodyParser      = require('body-parser');


//load custom modules:
//====================
var cn              = require('./custom_modules/modules/connections_module');
var db              = require('./custom_modules/db/admin/database');
var api             = require('./custom_modules/modules/api_module');
var campaigns       = require('./custom_modules/modules/campaigns_module');
var landers         = require('./custom_modules/modules/landers_module');
var pages           = require('./custom_modules/modules/pages_module');
var offers          = require('./custom_modules/modules/offers_module');
var trafficsrc      = require('./custom_modules/modules/trafficsrc_module');


//initialize the opnvpn connections before initializing the database module
//=========================================================================
//cn.init();


//initialize the database module:
//===============================
db.init();


//middleware
//==========
// express user-agent parser
app.use(ExpressUA.express());
// express cookie parser must be listed before the session
app.use(CookieParser()); 
// express session parser
app.use(ExpressSession({
  secret: app.get('secret_key'),
  name: app.get('app_cookie_name'),
  store: null,
  proxy: true,
  resave: false,
  saveUninitialized: false
})); 
// for parsing application/json
app.use(BodyParser.json()); 
app.use(Express.static('public'));


//hosts
//=====
app.route('/get/all/servers').get(api.get_all_servers);
app.route('/add/server').post(api.add_server);
app.route('/update/server').post(api.update_server);
app.route('/delete/server').post(api.delete_server);
app.route('/get/server/:host').get(api.get_server);
app.route('/:host/exchange/ip').get(api.exchange_hostname_for_ip);

//campaigns
//=========
app.route('/:host/get/all/campaigns').get(campaigns.get_all_campaigns);
app.route('/:host/get/all/active/campaigns').get(campaigns.get_all_active_campaigns);
app.route('/:host/get/all/paused/campaigns').get(campaigns.get_all_paused_campaigns);
app.route('/:host/get/campaign/:name').get(campaigns.get_campaign);
app.route('/:host/create/campaign').post(campaigns.create_campaign);
app.route('/:host/campaign/:name/delete').get(campaigns.delete_campaign);
app.route('/:host/campaign/:name/update/meta').post(campaigns.update_meta);
app.route('/:host/campaign/:name/set/offer').post(campaigns.set_offer);
app.route('/:host/campaign/:name/set/trafficsrc').post(campaigns.set_trafficsrc);
app.route('/:host/campaign/:name/add/lander').post(campaigns.add_lander);
app.route('/:host/campaign/:name/delete/lander/:landerid').get(campaigns.delete_lander);
app.route('/:host/campaign/:name/get/landerpool').get(campaigns.get_lander_pool);
app.route('/:host/campaign/:name/get/active/landers').get(campaigns.get_active_lander_pool);
app.route('/:host/campaign/:name/get/paused/landers').get(campaigns.get_paused_lander_pool);
app.route('/:host/campaign/:name/is/active').get(campaigns.is_active);
app.route('/:host/campaign/:name/activate').get(campaigns.activate_campaign);
app.route('/:host/campaign/:name/pause').get(campaigns.pause_campaign);
app.route('/:host/campaign/:name/setup/status').get(campaigns.get_setup_status);

//landers
//=======
app.route('/:host/get/all/landers/json').get(landers.get_all_landers_json);
app.route('/:host/get/all/landers').get(landers.get_all_landers);
app.route('/:host/get/lander/:landerid').get(landers.get_lander);
app.route('/:host/create/lander').post(landers.create_lander);
app.route('/:host/update/lander').post(landers.update_lander);
app.route('/:host/delete/lander').post(landers.delete_lander);

//pages
//=====
app.route('/:host/get/all/pages').get(pages.get_all_pages);


//offers
//======
app.route('/:host/get/all/offers/json').get(offers.get_all_offers_json);
app.route('/:host/get/offer/:offerid').get(offers.get_offer);
app.route('/:host/create/offer').post(offers.create_offer);
app.route('/:host/update/offer/:offerid').post(offers.update_offer);
app.route('/:host/delete/offer/:offerid').get(offers.delete_offer);
app.route('/:host/offer/:offerid/is/active').get(offers.is_active);
app.route('/:host/offer/:offerid/activate').get(offers.activate_offer);
app.route('/:host/offer/:offerid/pause').get(offers.pause_offer);


//traffic sources
//===============
app.route('/:host/get/trafficsources').get(trafficsrc.get_traffic_sources);
app.route('/:host/get/active/trafficsources').get(trafficsrc.get_active_traffic_sources);
app.route('/:host/get/paused/trafficsources').get(trafficsrc.get_paused_traffic_sources);
app.route('/:host/get/trafficsource/:trafficsrcid').get(trafficsrc.get_traffic_source);
app.route('/:host/create/trafficsource').post(trafficsrc.create_traffic_source);
app.route('/:host/update/trafficsource/:trafficsrcid').post(trafficsrc.update_traffic_source);
app.route('/:host/delete/trafficsource').post(trafficsrc.delete_traffic_source);
app.route('/:host/trafficsource/is/active').get(trafficsrc.is_active);
app.route('/:host/trafficsource/:tid/activate').get(trafficsrc.activate_traffic_source);
app.route('/:host/trafficsource/:tid/pause').get(trafficsrc.pause_traffic_source);

app.route('/shutdown').post(function(req, res){
    var process = require('process');
    res.send({response: "success"});
    process.exit();
});


//now start the server:
//=====================
server.listen(app.get('public_port'), function(){console.log('adminaffiliate server is now running on port '+app.get('public_port'));});


//initialise socket.io:
//=====================
io.on('connection', function (socket) {  
  /*
  socket.on('get-campaign', function(url_slug, callback){
    api.get_campaign(socket, url_slug, callback);
  });
  
  socket.on('join-room', function(roomname){
    socket.join(roomname); //http://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io
  });
  
  socket.on('redirect-user', function(nonce){
    io.to(nonce).emit('redirect-user');
  });
  
  socket.on('track-leadgen', function(data){
    var stat = {
      _campaign:  data.campaign,
      _lander:    data.lander,
      _offer:     data.offer,
      group:      data.group,
      type:       'leadgen'
    };
    db.stats.create(stat).exec();
  });
  */
});