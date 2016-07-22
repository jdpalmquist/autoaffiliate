/*
	Client Side Socket 
	------------------

	Lander Code
*/
//initialize socket.io
var socket = io.connect('/');
var nonce = '';

$(document).ready(function(){
	//acquire the url
	var parser = document.createElement('a'); 	//create a parser
	parser.href = window.location; 				//update parser url
	var query = parser.search; 					//get the query string of the url
	query = query.split(''); 					//break it into individual characters
	query.splice(0,1); 							//remove the '?' from the beginning of the query string
	query = query.join(''); 					//recombine the character array
	query = query.split('='); 					//break it on the '=' character
	if(query[0] == 'nonce'){
		nonce = query[1]; 						//if 0th is 'nonce' then 1st is the nonce value
	}
});


//attach the 'redirect_user()' method to the final 'onclick' event in your lander code 
var redirect_user = function(){
	//iframesocket.emit('redirect-user');
	socket.emit('redirect-user', nonce); 		//tell client.iframe.js to redirect user
};
//fin