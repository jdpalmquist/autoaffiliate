'use strict';

//nodemon:
//========
//  sudo nodemon -w /custom_modules -w /public -w ad_server.js -w package.json -e js,html,css,png,jpg,json


//initiate the ad server:
//=======================
var app             = require('express')();                         //express.js instance
var server          = require('http').Server(app);                  //httpServer object (required for socket.io)
var io              = require('socket.io')(server);                 //socket.io instance


//system properties:
//==================
app.set('app_name', 'autoaffiliate');                               //application name
app.set('secret_key', 'elkaiurnjvlew.rknmsrltkkUAejgrei8743ui54');  //secret session key, shhhhh
app.set('root_dir', __dirname);//process.env.APP_DIR);              //root file directory
app.set('public_port', process.env.PORT || 80);                     //Public port # (note: 80 for http, 443 for https)
app.set('track_visitors', true);                                    //diasbles/enables default raw tracking
app.set('app_mode', 'dev');                                         //domain switching
app.set('domain', 'localhost');                                     //domain defaults to dev: localhost
if(app.get('app_mode') == 'pro') 
  app.set('domain', 'example.production.com');                      //set the production domain here
app.set('app_cookie_name', app.get('app_name'));                    //app cookie name
app.set('database_name', app.get('app_name'));                      //database name
app.set('database_path', process.env.DBPATH || '127.0.0.1:27017');  //database connection path
app.set('mongo_connect', "mongodb://" + app.get('database_path') + "/" + app.get('database_name'));


//mongoose connection:
//====================
var Mongoose        = require('mongoose');
Mongoose.connect(app.get('mongo_connect')); //note, only call this here


//load standard modules:
//======================
var ExpressUA       = require('express-useragent');
var ExpressSession  = require('express-session');
var CookieParser    = require('cookie-parser');
var BodyParser      = require('body-parser');
var Lactate         = require('lactate');
var Chokidar        = require('chokidar');

//load custom modules:
//====================
//db:
//---
var db              = require('./custom_modules/db/database');
//api:
//----
var api             = require('./custom_modules/modules/api_module');
//system:
//-------
var sys             = require('./custom_modules/modules/system_module'); 


//system setup:
//=============
//
//watch the pages directory for changes
sys.init(app.get('root_dir'));



//
//initialize chokidar file watcher to watch the public/page directory
var public_pages_filepath = app.get('root_dir') + '/public/page';
var watcher = Chokidar.watch(public_pages_filepath, {
  ignored: /[\/\\]\./, persistent: true
});

var log = console.log.bind(console);
watcher
  .on('ready',      sys.watcher_ready)
  .on('add',        sys.watcher_file_added)
  .on('change',     sys.watcher_file_changed)
  .on('unlink',     sys.watcher_file_removed)
  .on('addDir',     sys.watcher_directory_added)
  .on('unlinkDir',  sys.watcher_directory_removed)
  .on('error',      sys.watcher_error)
  .on('raw',        sys.watcher_raw_event);


//Lactate:
//========
//  static file serving and request caching
//  this particular module handles serving the landers
//  note1: Lactate config requires dirs WITHOUT leading slash
//  note2: Lactate requires that the url look like this: 
//        /page/_x/index.html
var LactateDirs = [
  {
    filepath: 'public/page',
    obj: {from: '/page'}
  },
  {
    filepath: 'public/js',
    obj: {from: '/js'}
  }
];
var files = [];
for(var i = 0; i < LactateDirs.length; i++){
  files.push(
    Lactate.dir(
      LactateDirs[i].filepath,
      LactateDirs[i].obj
    )
  );
  files[i].enable('gzip');
  app.use(files[i].toMiddleware());
}



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
// track incoming requests
app.use(function (req, res, next) {
  if(app.get('track_visitors')){
    var visit = {
      ip: req.connection.remoteAddress,
      url: req.url,
      ua: req.useragent,
    };
    db.visit.create(visit, function(err, res){
      if(err)db.error.create({file:'ad.server.js', func:'req tracking middleware', err:err},function(a,b,c){});
    });
  }
  next();
});


//initialize the routes
//=====================
app.route('/:slug').get(api.get_template);
app.route('/postback').post(api.postback);



//now start the server:
//=====================
server.listen(app.get('public_port'), function(){console.log('ad.server is now running on port '+app.get('public_port'));});


//initialise socket.io:
//=====================
io.on('connection', function (socket) {  
  
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
    db.stats.create(stat, function(err,a,b,c){
      if(err)db.error.create({file:'ad.server.js', func:'socket.on(track-leadgen)', err:err},function(a,b,c){});
    });
  });
  
});
