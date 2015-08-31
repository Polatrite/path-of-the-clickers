var serverStorage = require('node-persist');

var Player = function(conf) {
	_.extend(this, {
		entityType: 'Player',
		
		username: '',
		inventory: [],
		minions: [],
		money: 0
	})

	_.extend(this, conf);
}

Player.prototype.clean = function() {
	return _.omit(this, [
		'password'
	]);
}

module.exports = Player;