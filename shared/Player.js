var uidManager = require(appRoot + '/shared/UidManager.js');
var Inventory = require(appRoot + '/shared/Inventory.js');

var Player = function(conf) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Player',
		
		username: '',
		inventory: null,
		minions: [],
		money: 0
	});
	
	this.inventory = new Inventory(40, this, {
		itemMovedCallback: function(inventory, item, action) {
			
		}
	});

	_.extend(this, conf);
}

Player.prototype.clean = function() {
	var clean = _.omit(this, [
		'password'
	]);
	
	return clean;
}

module.exports = Player;