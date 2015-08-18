var express = require('express');
var app = express();
var paperwork = require('paperwork');

app.use(express.static(__dirname + '/client'));

app.listen(process.env.PORT || 80);

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

console.log("Application running");