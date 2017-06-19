const config = require('./config.js');
const api = require('./api.js');

const express = require('express');

let path = require('path');
let app = express();

// middleware
let logger = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let serveStatic = require('serve-static');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(serveStatic(path.join(__dirname, config.staticFolder), {'index': ['index.html', 'index.htm']}));

// error handling
app.use(function(req, res, next){
	res.status(404);
	console.error('Not found URL: %s', req.url);
	res.send({ error: 'Not found' });
});
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	console.error('Internal error(%d): %s', res.statusCode, err.message);
	res.send({ error: err.message });
});

// Starting server
app.listen(1337, function(){
	console.log('Express server listening on port 1337');
});

