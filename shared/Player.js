var _ = require('underscore');
var Item = require('./Item.js');

var Player = function(conf) {
	this.inventory = [];
	this.minions = [];
	this.money = 0;

	_.extend(this, conf);
}

module.exports = Player;