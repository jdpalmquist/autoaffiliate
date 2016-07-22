//request module

var Fs 				= require('fs');
var db              = require('../db/database');
var Url 			= require('url');
var nonce 			= require('../modules/nonce_module');

exports.default = function(req, res){
	var ht = '';
	ht += '<!doctype html>';
	ht += '<html>';
		ht += '<head>';
			ht += '<title>';
				ht += '';
			ht += '</title>';
			ht += '<style type="text/css">';
				ht += 'html, body { height: 100%; min-height:100%; overflow:hidden;}';
				ht += '#page{position:absolute; top:0px; bottom:0px; left:0px; right:0px; border:none; width:100%; height:100%;}';
			ht += '</style>';
			ht += '<meta charset="utf-8">';
		ht += '</head>';
		ht += '<body>';
			//iframe
			ht += '<iframe id="page" width="100%;" height="100%;" src="/page/default/index.html"></iframe>';
			//socket.io
			ht += '<!-- socket.io -->';
			ht += '<script type="text/javascript" src="/socket.io/socket.io.js"></script>';
			ht += '<script type="text/javascript">';
				ht += 'var socket = io.connect("http://localhost");';
				ht += 'socket.on("news", function (data) {';
					//socket calls
				ht += '});';
			ht += '</script>';
		ht += '</body>';
	ht += '</html>'; 
	res.type('text/html');
	res.send(ht);	
};

exports.get_template = function(req, res){
	Fs.readFile('index.html', function(err, file){
		res.type('text/html');
		res.send(file);
	});
};

exports.get_campaign = function(socket, slug, callback){
	console.log('TODO: SERVE A DEFAULT SALES PAGE TO ALL URL SLUGS THAT DONT MATCH ACTIVE CAMPAIGNS!');
    //remove leading '/'
    slug = slug.split('');
    if(slug[0] == '/'){
        slug.splice(0,1);
    }
    slug = slug.join('')

    db.campaign
	.findOne({
        slug: slug,
        active: true
    })
	.populate('active_landers offer traffic_src')
	.exec(function(err,campaign){
		if(err){
			db.error.create({file:'api_module.js', func:'get_campaign', err:err},function(a,b,c){});
			callback({response: 'error'});
		}
		if(campaign != null && typeof campaign != 'undefined'){
			/*
			console.log("DEBUG: API MODULE --> get_campaign --> socket: ", socket);
			*/
			//declarations
			var ip, url, ua, group, divisor, index, lander, lander_id, lander_file_path, lander_url, offer, offer_id, offer_redirect_url;
			
            //connection tracking data
			ip = socket.request.remoteAddress;
      		url = socket.handshake.headers.referer;
      		ua = socket.handshake.headers['user-agent'];
      		
      		//campaign group tags
			var group = campaign.group;
			
			//lander index rotates with each page view
			//to do this I just increment the index +1 each pageview, then
			//the next time around I get that index and mod it by active_landers length
			//to figure out what the next lander will be:
			divisor = parseInt(campaign.active_landers.length);
			if(divisor != 0)
				index = parseInt(campaign.lander_index) % divisor;
			else
				index = 0;
			lander = campaign.active_landers[index];
			lander_id = null;
			lander_file_path = '';
			lander_url = '';
            if(lander != null && typeof lander != 'undefined'){
				lander_id = lander._id;
				lander_file_path = lander.filepath;
                lander_url = lander.url;
			}

			//offer
			offer = campaign.offer;
			offer_id = null;
			offer_redirect_url = '';
			if(offer != null && typeof offer != 'undefined'){
				offer_id = offer._id;
				offer_redirect_url = offer.redirect_url;
			}

			//progression check: build the page or abort?
			//===========================================
			if(lander != null && typeof lander != 'undefined' 
				/*&& offer != null && typeof offer != 'undefined'*/){
				
				//IMPORTANT: generate a nonce that will be the shared key 
				//			 between the iframe.html and the lander.html
				var n = nonce.randomString(25);

				//build the query string
				var q = '?nonce='+n; // test
				
				//save a reference to the leadgen, for conversion tracking later
				var leadgen_entry = {
					_campaign:  campaign._id,
				  	_lander:    lander_id,
				  	_offer:     offer_id,
				  	group: 		group,
				  	nonce: 		n
				};
				db.leadgen.create(leadgen_entry, function(err,a,b,c){
					if(err)db.error.create({file:'api_module.js', func:'get_campaign', err:err},function(a,b,c){});
				});


				//increment campaign "lander_index"
				//increment the total num of pageviews
				//====================================
				db.campaign.update({slug:slug}, {$inc:{lander_index:1, total_pv:1}}, function(err,a,b,c){
					if(err)db.error.create({file:'api_module.js', func:'get_campaign', err:err},function(a,b,c){});
				});

				//register the pageview in stats
				//==============================
				var stat = {
					_campaign:  campaign._id,
				  	_lander:    lander_id,
				  	_offer:     offer_id,
				  	group:      group,
				  	type:       'pageview',
				  	ip: 		ip,
				  	url: 		url,
				  	ua: 		ua
				};
				db.stats.create(stat, function(err,a,b,c){
					if(err)db.error.create({file:'api_module.js', func:'get_campaign', err:err},function(a,b,c){});
				});


                //calculate the current threshold needed to perform a reaping of active_landers and/or pause a campaign (if needed)
                var threshold = parseInt(campaign.phase) * parseInt(campaign.phase_interval);
                if(campaign.total_pv >= threshold){
                    //reaper check: check the phase, do we need to perform a lander reaping, and/or pause the campaign?
                    //=================================================================================================
                    /*
                        Algorithm:
                        ==========
                        1.) Take the given campaign, 
                        2.) Extact its stats: total page views, cost of advertising, total leadgens, total sales conversions
                        3.) Calculate profitability on each individual trafficsrc/lander/offer combo
                        4.) If a lander does not meet the profitiablity threshold (> 1%) mark it for removal
                        5.) Remove all marked landers from active_landers pool and put them in the removed)_landers pool (note: the db will pullall instances of a lander out of the pool with one command)
                        6.) check the campaign active_lander pool -- if the pool is zero, pause the entire campaign.
                        7.) increment the phase of the campaign so that this check won't be run until it meets threshold again.
                        8.) Goal: trim the campaign down to 1-3 super performing landers to concentrate all of our advertising dollars on a focused target!
                    */
                    var stats = {
                        total_pv: '',
                        total_lg: '',
                        total_cv: '',

                    };


                    //finish it!

                }



                //before replying, we need to attach nonce to the query string, 
                //  this is tricky because different affiliate networks will have different url query string variables
                //  for passing this data back to you.

				//reply object
				var data = {
					response: 			'success',
					nonce: 				n,
					campaign: 	 		campaign._id,
					lander: 			lander_id,
					lander_file_path: 	lander_file_path + q,
                    lander_url:         lander_url + q,
					offer: 	 			offer_id,
					redirect_url: 		offer_redirect_url
				};

				//send the response:
				//==================
				callback(data);
			}
			else{
				callback({response: 'error'});
			}
		}
		else{
            callback({response: '404'});
		}
	});
};

exports.postback = function(req, res){
	var originalUrl, campaign, lander, offer, group, ip, url, query, nonce;
    originalUrl = req.url;
	ip = req.connection.remoteAddress;
    ua = req.useragent;

    //parse the URL to extact campaign, lander, offer[, group]
    url = Url.parse(originalUrl);
    
    //somehow send the nonce to the offer and have it returned for refence on the 
    db.leadgen
    .find({nonce: nonce})
    .exec(function(err, leadgen){
    	if(err)db.error.create({file:'api_module.js', func:'postback', err:err},function(a,b,c){});
    	if(leadgen != null && typeof leadgen != 'undefined'){
	
    		//console.log('DEBUG: API MODULE --> postback() --> url.parsed: ', url);
    		query = url.query;

    		

    		//TODO: parse out the nonce from the query string???
    		//NOTE: I might need to add a "conversion_url_var" to the offer objects
    		//		that way I can specify the name of a callback query string var
    		//		that the ad network will return with my conversion notification


    		//TODO: uncomment and run this
	    	/*
			//register the pageview in stats
			//==============================
			campaign = leadgen._campaign;
			lander = leadgen._lander;
			offer = leadgen._offer;
			group = leadgen.group;
			var stat = {
				_campaign:  campaign,
			  	_lander:    lander,
			  	_offer:     offer,
			  	group:      group,
			  	type:       'conversion',
			  	ip: 		ip,
			  	url: 		originalUrl,
			  	ua: 		ua
			};
			db.stats.create(stat).exec();
			*/  

			//And finally credit the campaign for its total_cv count
			//TODO:  		
    	}

    });

	res.send();
};