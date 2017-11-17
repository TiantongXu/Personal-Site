var crypto = require('crypto');
// var Memcached = require('memcached');
// var memcached = new Memcached('localhost:11211');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var db;

// require("jsdom").env("", function(err, window) {
//     if (err) {
//         console.error(err);
//         return;
//     }
 
//     var $ = require("jquery")(window);
// });

// app.refresh = function () {
// 	var e = document.createElement('div');
// 	e.className = "message";
// 	e.innerHTML = `
// 		<div class='message_user'>
// 		    <div class='message_picture'></div>
// 		    <div class='message_username'></div>
// 		</div>
// 		<div class='message_content'></div>
// 		</div>`;
// 		document.getElementById("mainbody").prepend(e);
// 	};

app.use(express.static('frontend'));

app.get('/', function (req, res, next) {
    return res.redirect('index.html');
});

app.post('/experience', function (req, res, next) {
	console.log(req.body);
  	return res.redirect('/index.html');
});

app.post('/login', function (req, res, next) {
	console.log(req.body);
  	return res.redirect('/index.html');
});

var http = require('http');
http.createServer(app).listen(3000, function () {
    console.log('HTTP on port 3000');
});