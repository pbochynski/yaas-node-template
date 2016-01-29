// In-memory cache

var lruCache = require('lru-cache');
var tenants = lruCache(100);

function getTenantCache(tenant) {
	var cache = tenants.get(tenant);
	if (!cache) {
		cache = lruCache(100);
		tenants.set(tenant, cache);
	}
	return cache;
}
function get(tenant, key) {
	return getTenantCache(tenant).get(key);
}

function set(tenant, key, value) {
	return getTenantCache(tenant).set(key, value);
}

function del(tenant, key) {
	return getTenantCache(tenant).del(key);
}

function values(tenant) {
	return getTenantCache(tenant).values();
}

exports.get = get;
exports.set = set;
exports.del = del;
exports.values = values;
