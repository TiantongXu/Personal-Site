var crypto = require('crypto');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require("redis");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var url = ;
var redisClient = redis.createClient({host: , port: });

redisClient.auth(, function (err) {
    if (err) console.log(err);
});

app.use(session ({
	store: new RedisStore({client: redisClient}),
	secret: 'Secret site token',
	resave: false,
	saveUninitialized: true,
	cookie: {sameSite: true, maxAge: 1000 * 60 * 60},
}));

var validateInfo = function (user, password) {
	var hash = crypto.createHmac('sha512', user.salt);
	hash.update(password);
	return (user.password === hash.digest('base64'));
};

app.use(express.static('frontend'));

app.post('/api/signin/', function (req, res, next) {
	if (!req.body.username || !req.body.password) return res.status(400).send("Please fill in all the fields");
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('admin').findOne({username: req.body.username}, function(err, user) {
			if (err) return res.status(500).end(err);
			if (!user || !validateInfo(user, req.body.password)) return res.status(401).end("Incorrect username/password");
			req.session.user = user;
			res.cookie('username', user.username, {sameSite: true, maxAge: 1000 * 60 * 60});
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
});

app.get('/api/experience/', function (req, res, next) {
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('experience').find().toArray(function (err, result) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.send(result);
		});
		db.close();
	});
});

app.get('/api/education/', function (req, res, next) {
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('education').find().toArray(function (err, result) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.send(result);
		});
		db.close();
	});
});

app.get('/api/skills/', function (req, res, next) {
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('skills').find().toArray(function (err, result) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.send(result);
		});
		db.close();
	});
});

app.post('/api/experience/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('experience').save({date: req.body.date, employer: req.body.employer, place: req.body.place, position:req.body.position, details: req.body.details}, function(err, user) {
			if (err) return res.status(500).end(err);
			return res.json(user);
			db.close();
		});
		db.close();
	});
});

app.post('/api/skills/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('skills').save({details: req.body.details}, function(err, user) {
			if (err) return res.status(500).end(err);
			return res.json(user);
			db.close();
		});
		db.close();
	});
});

app.post('/api/education/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
	if (err) throw err;
		db.collection('education').save({details: req.body.details}, function(err, user) {
			if (err) return res.status(500).end(err);
			return res.json(user);
			db.close();
		});
		db.close();
	});
});


app.patch('/api/experience/:id/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('experience').update({_id: new mongo.ObjectID(req.body._id)}, {date: req.body.date, employer: req.body.employer, place: req.body.place, position: req.body.position, details: req.body.details}, function (err) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.json("");
		});
		db.close();
	});
});

app.patch('/api/education/:id/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('education').update({_id: new mongo.ObjectID(req.body._id)}, {details: req.body.details}, function (err) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.json("");
		});
		db.close();
	});
});

app.patch('/api/skills/:id/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('skills').update({_id: new mongo.ObjectID(req.body._id)}, {details: req.body.details}, function (err) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.json("");
		});
		db.close();
	});
});

app.delete('/api/experience/:id/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('experience').remove({_id: new mongo.ObjectID(req.params.id)}, function (err) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.end();
		});
		db.close();
	});
});

app.delete('/api/skills/:id/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('skills').remove({_id: new mongo.ObjectID(req.params.id)}, function (err) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.end();
		});
		db.close();
	});
});

app.delete('/api/education/:id/', function (req, res, next) {
	if (!req.session.user) return res.status(403).end("Not authorized");
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('education').remove({_id: new mongo.ObjectID(req.params.id)}, function (err) {
			if (err) return res.status(500).send("Database error");
			db.close();
			return res.end();
		});
		db.close();
	});
});

var http = require('http');
http.createServer(app).listen(8080, function () {
	console.log('HTTP up and running running on port 8080');
});