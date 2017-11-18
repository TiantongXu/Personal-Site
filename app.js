var crypto = require('crypto');
// var Memcached = require('memcached');
// var memcached = new Memcached('localhost:11211');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var url = "mongodb://txadmin:Scarlet6@ds127063.mlab.com:27063/txsitedb";
var db;
var userdb;

var authorized = false;

app.use(session ({
	secret: 'Secret site token',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true, sameSite: true, maxAge: 3600000}
}));

var User = function (user) {
	var salt = crypto.randomBytes(16).toString('base64');
	var hash = crypto.createHmac('sha512', salt);
	hash.update(user.password);
	this.username = user.username;
	this.salt = salt;
	this.saltedHash = hash.digest('base64');
};

var validateInfo = function (user, password) {
	var hash = crypto.createHmac('sha512', user.salt);
	hash.update(password);
	return (user.password === hash.digest('base64'));
};

mongo.connect(url, function(err, db) {
	if (err) throw err;
	userdb = db.collection('admin');
	db.close();
});

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

app.post('/api/experience/', function (req, res, next) {
	return res.redirect('/index.html');
});

app.post('/api/signin/', function (req, res, next) {
	if (!req.body.username || !req.body.password) return res.status(400).send("Please fill in all the fields");
	userdb.findOne({username: req.body.username}, function(err, user) {
		if (err) return res.status(500).end(error);
		if (!user || !validateInfo(user, req.body.password)) return res.status(401).end("Incorrect username/password");
		authorized = true;
		return res.json(user);
	});
});

app.get('/api/signout/', function (req, res, next) {
    // req.session.destroy(function(err) {
    //     if (err) return res.status(500).end(err);
    //     return res.end();
    // });
	authorized = false;
});

var http = require('http');
http.createServer(app).listen(3000, function () {
	console.log('HTTP on port 3000');
});