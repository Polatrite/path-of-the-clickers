var uidManager = require(appRoot + '/server/UidManager.js');
var Player = require(appRoot + '/shared/Player.js');
    Player = require(appRoot + '/server/SavePlayer.js');

var PlayerManager = {};

PlayerManager.create = function(conf) {
	var player = new Player(conf);
	player.uid = uidManager.next();
	player.save();
	PlayerManager[player.uid] = player;
	return player;
}

PlayerManager.load = function(conf) {
	if(typeof(comp) === 'Number' && PlayerManager[conf]) {
		return PlayerManager[conf];
	}
	var player = new Player();
	player = player.load(conf);
	PlayerManager[player.uid] = player;
	return player;
}

module.exports = PlayerManager;