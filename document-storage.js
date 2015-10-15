var request = require('request');
var config = require('config');
var NodeCache = require('node-cache');
var myCache = new NodeCache({stdTTL: 3000, checkperiod: 120});

function repoUrl(tenant) {
	return config.get('repoUrl') + '/' + tenant + '/' + config.get('oauth.yaas_client') + '/data/wishlists';
}

function get(tenant, key, callback) {
	token(tenant, function (err, token) {
		request.get(repoUrl(tenant) + '/' + key, {auth: {bearer: token}}, function (err, res, body) {
			if (err) return callback(err);
			callback(null, (res.statusCode === 200 && body) ? JSON.parse(body) : null);

		});
	});
}

function set(tenant, key, value, callback) {
	token(tenant, function (err, token) {
		request.put(repoUrl(tenant) + '/' + key, {auth: {bearer: token}, qs: {upsert: "true"}, json: value}, function (err) {
			if (err) return callback(err);
			callback(null);
		});
	});
}

function del(tenant, key, callback) {
	token(tenant, function (err, token) {
		request.del(repoUrl(tenant) + '/' + key, {auth: {bearer: token}}, function (err, res, body) {
			if (err) return callback(err);
			callback(null);
		});
	});
}

function values(tenant, callback) {
	token(tenant, function (err, token) {
		request.get(repoUrl(tenant), {auth: {bearer: token}}, function (err, res, body) {
			if (err) return callback(err);
			callback(null, (res.statusCode === 200 && body) ? JSON.parse(body) : null);
		});
	});
}


function token(tenant, callback) {
	var token = myCache.get(tenant);
	if (token) {
		return callback(null, token);
	}
	request.post(config.get('oauth.tokenUrl'),
		{
			form: {
				client_id: config.get('oauth.client_id'),
				client_secret: config.get('oauth.client_secret'),
				grant_type: 'client_credentials',
				scope: 'hybris.document_manage hybris.document_view hybris.tenant=' + tenant
			}
		},
		function (error, response, body) {
			if (error) {
				console.error(error);
				return callback(error);
			} else {
				var token = JSON.parse(body).access_token;
				myCache.set(tenant, token);
				callback(null, token);
			}
		});
}


exports.get = get;
exports.set = set;
exports.del = del;
exports.values = values;