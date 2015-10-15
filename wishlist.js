var app = require('express')();
var storage = require('./document-storage');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

app.use(bodyParser.json());
app.use(validateTenantWithProxyHeader);

function internalError(err, res) {
	console.error(err);
	res.status(500).send({message: err});
}

app.get('/:tenant/wishlists', function (req, res) {
	storage.values(req.params.tenant, function (err, value) {
		if (err) {
			return internalError(err, res);
		}
		res.send(value);
	});

});

app.get('/:tenant/wishlists/:id', function (req, res) {
	storage.get(req.params.tenant, req.params.id, function (err, value) {
		if (err) {
			return internalError(err, res);
		}
		if (value) {
			delete value['metadata'];
			return res.send(value);
		}
		else {
			res.status(404).send();
		}
	});
});

app.put('/:tenant/wishlists/:id', function (req, res) {
	var id = req.params.id;
	req.body.id = id;
	storage.set(req.params.tenant, id, req.body, function (err) {
		if (err) {
			return internalError(err, res);
		}
		res.send({id: id});
	});
});

app.delete('/:tenant/wishlists/:id', function (req, res) {
	storage.del(req.params.tenant, req.params.id, function (err) {
		if (err) {
			return internalError(err, res);
		}
		res.send();
	});
});

app.post('/:tenant/wishlists', function (req, res) {
	var id = uuid.v4();
	req.body.id = id;
	storage.set(req.params.tenant, id, req.body, function (err){
		if (err) {
			return internalError(err, res);
		}
		res.send({id: id});
	});
});

function validateTenantWithProxyHeader(req, res, next) {
	var tenantHeader = req.headers['hybris-tenant'];
	if (tenantHeader && tenantHeader !== req.params.tenant) {
		return res.status(403).send({message: "Provided tenant doesn't match tenant used for issued access token"});
	}
	next();
}


exports.app = app;