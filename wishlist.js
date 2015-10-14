var app = require('express')();
var storage = require("lru-cache")(100); // memory LRU cache for 100 wishlists - replace it with real storage :)
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

app.use(bodyParser.json());

app.get('/wishlists',function(req,res) {
	res.send(storage.values());
});

app.get('/wishlists/:id',function(req,res) {
	var wishlist = storage.get(req.params.id);
	if (wishlist) {
		return res.send(wishlist);
	}
	res.status(404).send();
});

app.put('/wishlists/:id',function(req,res) {
	var id = req.params.id;
	req.body.id = id;
	storage.set(id, req.body);
	res.send({id: id});
});

app.delete('/wishlists/:id',function(req,res) {
	storage.del(req.params.id);
	res.send();
});

app.post('/wishlists',function(req,res) {
	var id = uuid.v4();
	req.body.id = id;
	storage.set(id, req.body);
	res.send({id: id});
});

exports.app = app;