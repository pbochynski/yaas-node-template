var app = require('express')();
var examples = require('./public/api-console/raml/wishlists-example.json');
var wishlists = require("lru-cache")(100); // memory LRU cache for 100 wishlists - replace it with real storage :)
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

app.use(bodyParser.json());

app.get('/wishlists',function(req,res) {
	res.send(wishlists.values());
});

app.get('/wishlists/:id',function(req,res) {
	var wishlist = wishlists.get(req.params.id);
	if (wishlist) {
		return res.send(wishlist);
	}
	res.status(404).send();
});

app.put('/wishlists/:id',function(req,res) {
	var id = req.params.id;
	req.body.id = id;
	wishlists.set(id, req.body);
	res.send({id: id});
});

app.delete('/wishlists/:id',function(req,res) {
	wishlists.del(req.params.id);
	res.send();
});

app.post('/wishlists',function(req,res) {
	var id = uuid.v4();
	req.body.id = id;
	wishlists.set(id, req.body);
	res.send({id: id});
});

// Load examples into cache
examples.forEach(function(example){wishlists.set(example.id, example)});

exports.app = app;