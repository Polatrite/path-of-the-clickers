var express = require('express');
var paperwork = require('paperwork');

var UidManager = require(appRoot + '/shared/UidManager.js');
var PlayerManager = require(appRoot + '/server/PlayerManager.js');
var Item = require(appRoot + '/shared/Item.js');

var router = express.Router();

router.post('/create', function(req, res) {
	console.log(req.session);
	if(req.session.playerUid) {
		console.log("Found session already: ", req.session.playerUid);
		resyncPlayer(res, req.session.playerUid);
		return;
	}

	var player = PlayerManager.create();
	req.session.playerUid = player.uid;
	console.log("SESSION: ", req.session);
	res.send(player.clean());
});

router.post('/:uid/signup', paperwork.accept({
	uid: Number,
	username: String,
	password: String,
	email: /[^@]+@[^@]+/,
	captcha: String
}), function(req, res) {
	var uid = req.body.uid;
	var username = req.body.username;
	var player;

	player = PlayerManager.load({ loadByUsername: req.body.username });
	if(player) {
		console.error('Tried to load a username that already exists:', player);
		return res.send('Username already exists.', 500);
	}
	
	player = PlayerManager.load(uid);
	if(!player) {
		console.error("Couldn't find a player for UID " + uid, player);
		return res.send("We couldn't find that player to associate this account information with. This is bad news bears.", 500);
	}
	
	player.username = req.body.username;
	player.password = req.body.password;
	player.email = req.body.email;
	player.save();
	res.send(player.clean());
});

router.post('/login', paperwork.accept({
	username: String,
	password: String
}), function(req, res) {
	var player = PlayerManager.load({ loadByUsername: req.body.username });
	if(!player) {
		console.error("Couldn't find a player", req.body);
		return res.send("Player doesn't exist", 401);
	}
	if(req.body.password !== player.password) {
		console.error('Incorrect password attempt', player);
		return res.send('Incorrect password', 401);
	}
	
	req.session.playerUid = player.uid;
	console.log("SESSION: ", req.session);

	res.send(player.clean());
});

router.post('/resync', paperwork.accept({
	playerUid: Number
}), function(req, res) {
	resyncPlayer(res, req.session.playerUid);
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

function resyncPlayer(res, playerUid) {
	console.log("Resync triggered on " + playerUid);
	var player = UidManager.get(playerUid);
	res.send(player.clean());
}

console.log('Initialized routes');

module.exports = router;