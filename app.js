var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socketIoServer = require('socket.io');
var ioServer = socketIoServer(server);
var paperwork = require('paperwork');

server.listen(process.env.PORT, process.env.IP);
ioServer.listen(server);

var url = process.env.IP + ":" + process.env.PORT;
/*console.log("Attempting to start Express... on " + url);
var listener = app.listen(process.env.PORT, function(err) {
	console.log("Express started");
	console.log("Attempting to start socket.io...");
	var servListener = server.listen(process.env.PORT, function(err) {
		console.log("socket.io started");
		console.log("Error?", err);
		console.log("Everything up and running on port ", listener.address());
		console.log("And", servListener);
	});
});*/



app.use(express.static(__dirname + '/client'));


/*
https://github.com/Polatrite/paperwork



*/
var playerSignupModel = {
	username: String,
	password: String,
	email: /[^@]+@[^@]+/
}

app.post('/player/:id/signup', paperwork.accept(playerSignupModel), function(req, res) {

});

app.post('/player/create', function(req, res) {
	return new Player();
});

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