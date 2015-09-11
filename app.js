//require('long-stack-traces');
GLOBAL.appRoot = require('app-root-path');
GLOBAL.Util = require(appRoot + '/shared/utilities.js');
GLOBAL._ = require('underscore');
GLOBAL.strf = require(appRoot + '/shared/strf.js');

GLOBAL.MAX_RENEGADE_LOOPS = 120;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var http = require('http');

var crypto = require('crypto');
var server = http.createServer(app);
var socketIoServer = require('socket.io');
var ioServer = socketIoServer(server);
var serverStorage = require('node-persist');

var router = express.Router();

function dbIfy(value) {
	return JSON.stringify(value, undefined, 2);
}

serverStorage.initSync({
	dir: appRoot + '/database',
	stringify: dbIfy
});

GLOBAL.$E = require(appRoot + '/shared/uid.js');
//console.log(serverStorage.values());

app.use(cookieParser());
app.use(session({
	secret: 'toto-gonna-wreck-the-market-so-hard'
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client'));

app.use('/player', require(appRoot + '/server/PlayerRoutes.js'));
app.use('/item', require(appRoot + '/server/ItemRoutes.js'));

if(!process.env.PORT) process.env.PORT = 8080;
server.listen(process.env.PORT, process.env.IP);
console.log("Theoretically listening on " + process.env.IP + ":" + process.env.PORT);
ioServer.listen(server);

var usernames = {};
var numUsers = 0;

ioServer.on('connection', function(socket) {
	console.log("User connected");
	var addedUser = false;
	socket.emit('user connected', 'user connceted');

	socket.on('new message', function(data) {
		// we tell the client to execute 'new message'
		console.log('Received message: ', data);
		ioServer.emit('new message', {
			username: socket.username,
			message: data,
			timestamp: Date.now()
		});
		console.log('Message emited: ', data);
	});

	// when the client emits 'add user', this listens and executes
	socket.on('add user', function(username) {
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		++numUsers;
		addedUser = true;
		socket.emit('login', {
			numUsers: numUsers
		});
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('user joined', {
			username: socket.username,
			numUsers: numUsers
		});
	});

	// when the client emits 'typing', we broadcast it to others
	socket.on('typing', function() {
		socket.broadcast.emit('typing', {
			username: socket.username
		});
	});

	// when the client emits 'stop typing', we broadcast it to others
	socket.on('stop typing', function() {
		socket.broadcast.emit('stop typing', {
			username: socket.username
		});
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function() {
		// remove the username from global usernames list
		if (addedUser) {
			delete usernames[socket.username];
			--numUsers;

			// echo globally that this client has left
			socket.broadcast.emit('user left', {
				username: socket.username,
				numUsers: numUsers
			});
		}
	});
});

console.log("We running this joint!");

var test = require(appRoot + '/test.js');


var derp = require(appRoot + '/game-data/AffixData.js');
console.log(derp.stats.attack.length);