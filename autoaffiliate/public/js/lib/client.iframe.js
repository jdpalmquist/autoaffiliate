/*
	Client Side Socket
	------------------

	Iframe Code
*/
//initialize socket.io
var socket = io.connect('/');
//campaign, lander and offer
var cdata = {};
//acquire the url
var parser = document.createElement('a');
parser.href = document.URL;
var url_slug = parser.pathname;
console.log('DEBUG: client.iframe.js --> url_slug: ', url_slug);
socket.emit('get-campaign', url_slug, function(data){
	if(data.response == 'success'){		
		//this call enables the client.lander.js to signal us when a user is ready for redirect
		//to an offer page
		socket.emit('join-room', data.nonce);
		//save a copy of the campaign data for the socket.on(redirect-user) event handler to use later
		cdata = data;
		//IMPORTANT: this listener waits from a signal initiated by the client.lander.js before redirecting
		socket.on('redirect-user', function(nonce){
			//this is a successful click through event, track this in server side stats
			socket.emit('track-leadgen', {campaign: cdata.campaign, lander: cdata.lander, offer: cdata.offer, group: cdata.group});
			window.location = cdata.redirect_url;
		});
		//inject the iframe into the page
		var h = '<iframe id="page" src="'+data.lander_url+'" width="100%;" height="100%;"></iframe>';
		//var h = '<iframe id="page" width="100%;" height="100%;" src="/page/default/index.html?nonce='+data.nonce+'" sandbox="allow-scripts"></iframe>';
		jQuery("body").html(h);		
	}
    else if(data.response == '404'){
        //url slug not found, serve the default page
        console.log('TODO: SERVE A DEFAULT SALES PAGE TO ALL URL SLUGS THAT DONT MATCH ACTIVE CAMPAIGNS!');
    }
	else{
		console.log('Error: socket.emit(get-campaign)');
	}
});	