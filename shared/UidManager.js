var serverStorage = require('node-persist');

var UidManager = {
	currentUid: serverStorage.getItem('UidManager') || 100000,
	entities: {}
}

module.exports = {
	next: function(entity) {
		UidManager.currentUid++;
		serverStorage.setItem('UidManager', UidManager.currentUid);
		UidManager.entities[UidManager.currentUid] = entity;
		return UidManager.currentUid;
	},
	current: function() {
		return UidManager.currentUid;
	},
	
	add: function(entity) {
		UidManager.entities[entity.uid] = entity;
	},
	
	get: function(uid) {
		return UidManager.entities[uid];
	}
}
