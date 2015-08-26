var serverStorage = require('node-persist');

var Item = require('./Item.js');

var Player = function(conf) {
	this.username = '(null)';
	this.name = '(null)';
	this.inventory = [];
	this.minions = [];
	this.money = 0;
	
	_.extend(this, conf);
}

Player.prototype.clean = function() {
	return _.omit(this, [
		'password'
	]);
}

module.exports = Player;