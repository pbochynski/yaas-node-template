var app = require('express')();
var storage = require('./multi-tenant-cache');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

app.use(bodyParser.json());

app.get('/:tenant/wishlists',function(req,res) {
	res.send(storage.values(req.params.tenant));
});

app.get('/:tenant/wishlists/:id',function(req,res) {
	var wishlist = storage.get(req.params.tenant, req.params.id);
	if (wishlist) {
		return res.send(wishlist);
	}
	res.status(404).send();
});

app.put('/:tenant/wishlists/:id',function(req,res) {
	var id = req.params.id;
	req.body.id = id;
	storage.set(req.params.tenant, id, req.body);
	res.send({id: id});
});

app.delete('/:tenant/wishlists/:id',function(req,res) {
	storage.del(req.params.tenant, req.params.id);
	res.send();
});

app.post('/:tenant/wishlists',function(req,res) {
	var id = uuid.v4();
	req.body.id = id;
	storage.set(req.params.tenant, id, req.body);
	res.send({id: id});
});


exports.app = app;