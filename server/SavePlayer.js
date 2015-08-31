var serverStorage = require('node-persist');
var Player = require(appRoot + '/shared/Player.js');

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

Player.prototype.loadById = function(id) {
	_.extend(this, serverStorage.getItem(id));
	if(!this.username)
		return false;
	return this;
}

Player.prototype.loadByUsername = function(username) {
	_.extend(this, 
		_.find(serverStorage.values(), function(entity) {
			return entity.entityType == 'Player' && entity.username == username;
		})
	);
	if(!this.username)
		return false;
	return this;
}

Player.prototype.save = function() {
	serverStorage.setItem(this.uid.toString(), this);
	console.log("Player [" + this.username + "] saved");
	return true;
}

module.exports = Player;