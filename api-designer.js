var path = require('path');
var express = require('express');
var ramlStore = require('express-raml-store');
var app = express();

app.use('/api-designer', ramlStore(path.join(__dirname, 'public/api-console/raml')));
var server = app.listen(3000, function () {
	console.log('Open http://localhost:%d/api-designer/ to browse api-designer', server.address().port);
});