var UidManager = require(appRoot + '/shared/UidManager.js');
var Player = require(appRoot + '/shared/Player.js');
var Inventory = require(appRoot + '/shared/Inventory.js');
var Item = require(appRoot + '/shared/Item.js');

Player.prototype.load = function(conf) {
	if(typeof conf === 'object') {
		if('loadById' in conf) {
			return this.loadById(conf.loadById);
		}
		if('loadByUsername' in conf) {
			return this.loadByUsername(conf.loadByUsername);
		}
	} else {
		return this.loadById(conf);
	}
}

Player.prototype.loadExternalEntities = function() {
	this.inventory = new Inventory(this.inventory.items.length, this, this.inventory);
	UidManager.add(this.inventory);
	this.stash = new Inventory(this.stash.items.length, this, this.stash);
	UidManager.add(this.stash);
	for(var i = 0; i < this.inventory.items.length; i++) {
		if(this.inventory.items[i]) {
			this.inventory.items[i] = new Item(this.inventory.items[i]);
			UidManager.add(this.inventory.items[i]);
		}
	}
}

Player.prototype.loadById = function(id) {
	_.extend(this, UidManager.get(id));
	if(!this.username)
		return false;
	this.loadExternalEntities();
	return this;
}

Player.prototype.loadByUsername = function(username) {
	_.extend(this, 
		UidManager.getByFunc(function(entity) {
			return entity.entityType == 'Player' && entity.username == username;
		})
	);
	if(!this.username)
		return false;
	this.loadExternalEntities();
	return this;
}

Player.prototype.save = function() {
	UidManager.save(this.uid);
	console.log("Player [" + this.username + "] saved");
	return true;
}

module.exports = Player;