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
	return serverStorage.getItem(id);
}

Player.prototype.loadByUsername = function(username) {
	return _.find(serverStorage.values(), function(entity) {
		return entity.type == 'Player' && entity.username == username;
	});
}

Player.prototype.save = function() {
	return serverStorage.setItem(this.uid.toString(), this);
}

module.exports = Player;