"use strict"

const http = require('http');

let connect = require('connect'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	compression = require('compression'),
	timeout = require('connect-timeout'),
	serveStatic = require('serve-static'),
	bodyParser = require('body-parser');

let Rest = require('connect-rest');
let restBuilder = require('./restBuilder');

let app = connect()
	.use(compression())
	.use(timeout(2000))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json());

let options = {
  	context: '/api',
  	logger: { file: 'server.log', level: 'debug' },
    apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9' ],
  	discoverPath: 'discover',
  	protoPath: 'proto',
  	loose: { after: 1000 },
  	domain: true
}

var rest = Rest.create(options);
app.use(rest.processRequest());
app.use(restBuilder.getDispatcher(Rest));

restBuilder.buildUpRestAPI(rest);

let port = process.env.SRVPORT || 3001;
let server = http.createServer(app);

server.listen(port, function () {
	console.log('rest api server running on http://localhost:' + port)
});
