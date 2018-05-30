// Names: Michael Duncan and Patrick Guo
var express = require('express');
var app = express();
var multer = require('multer');
var bodyparser = require('body-parser');
var fs = require('fs');

var upload = multer({ dest: '/frames/'}).single('frame');
app.use(bodyparser.json({limit: '50mb'}));

var new_frame = null;
var curr_frame = null;
var needs_update = false;

var get_queue = [];
var address_queue = {};

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});


app.get('/', function(req, res){
	res.sendfile('main.html');
});
app.get('/record', function(req, res){
	res.sendfile('host.html');
});
app.get('/view', function(req, res){
	res.sendfile('view.html');
});


app.post('/uploadframe', function(req, res){
	res.end("success");
	console.log(get_queue.length);
	for(var queueResponse of get_queue)
	{
		queueResponse.write(req.body.img);
		queueResponse.end();
	}
	get_queue = [];
	address_queue = {};
});

app.get('/getframe', function(req, res){
	var ip = req.connection.remoteAddress.toString();
	if(address_queue[ip] !== true)
	{
		get_queue[get_queue.length] = res;
		address_queue[ip] = true;
	}
});

var server = app.listen(8080, function(){
	console.log("server started");
});

