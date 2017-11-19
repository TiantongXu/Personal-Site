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

var authorized = false;

app.use(session ({
	secret: 'Secret site token',
	resave: false,
	saveUninitialized: true,
}));

var validateInfo = function (user, password) {
	var hash = crypto.createHmac('sha512', user.salt);
	hash.update(password);
	return (user.password === hash.digest('base64'));
};

app.use(express.static('frontend'));

// app.get('/', function (req, res, next) {
// 	console.log("got dat session");
// });

app.post('/api/experience/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	console.log(req.session.user);
	return res.json(user);
});

app.post('/api/signin/', function (req, res, next) {
	if (!req.body.username || !req.body.password) return res.status(400).send("Please fill in all the fields");
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('admin').findOne({username: req.body.username}, function(err, user) {
			if (err) return res.status(500).end(err);
			if (!user || !validateInfo(user, req.body.password)) return res.status(401).end("Incorrect username/password");
			req.session.user = user;
			res.cookie('username', user.username, {secure: true, sameSite: true});
			return res.json(user);
		});
	db.close();
	});
});

app.get('/api/signout/', function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.end();
    });
});

app.get('/api/sign/', function (req, res, next) {
	if (!req.session.user) return res.send('false');
	return res.send('true');
})

var http = require('http');
http.createServer(app).listen(3000, function () {
	console.log('HTTP on port 3000');
});