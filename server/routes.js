var express = require('express');
var paperwork = require('paperwork');

var PlayerManager = require(appRoot + '/server/PlayerManager.js');

var router = express.Router();

router.post('/create', function(req, res) {
	res.send(PlayerManager.create().clean());
});

router.post('/:uid/signup', paperwork.accept({
	uid: Number,
	username: String,
	password: String,
	email: /[^@]+@[^@]+/,
	captcha: String
}), function(req, res) {
	var uid = req.body.uid;
	var player = PlayerManager.load(uid);
	if(player !== undefined) {
		player.username = req.body.username;
		player.password = req.body.password;
		player.email = req.body.email;
		player.save();
		res.send(player.clean());
	} else {
		res.send(500);
	}
});

router.post('/login', paperwork.accept({
	username: String,
	password: String
}), function(req, res) {
	var player = PlayerManager.load({ loadByUsername: req.body.username });
	
	if(req.body.password == player.password) {
		res.send(player.clean());
	} else {
		res.send(401);
	}
});

router.get('/:username', function(req, res) {
	paperwork({
		username: String
	}, req.params, function(err, validated) {
		if(err) { console.error(err); res.send(500); }

		res.send(PlayerManager.load({
			loadByUsername: req.params.username
		}).clean());
	});
});

router.post('/:uid/changePassword', paperwork.accept({
	username: String,
	oldPassword: String,
	newPassword: String
}), function(req, res) {
	
});

console.log('Initialized routes');

module.exports = router;