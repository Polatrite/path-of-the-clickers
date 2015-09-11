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
		if(UidManager.entities[entity.uid]) {
			console.error("UidManager.add(): #" + entity.uid + " already added?!");
			return false;
		}
		UidManager.entities[entity.uid] = entity;
		//console.log("UidManager.add(): Added " + entity.entityType + " #" + entity.uid);
	},
	
	get: function(uid) {
		if(!UidManager.entities[uid]) {
			UidManager.entities[uid] = serverStorage.getItem(uid);
			console.log("UidManager.get(): #" + uid + " loaded from database.");
		}
		//console.log("UidManager.get(): Returning ", uid);
		return UidManager.entities[uid];
	},
	
	getByFunc: function(findFunc) {
		var entity = _.find(serverStorage.values(), findFunc);
		//if(entity)
		//	console.log("UidManager.get(): Returning ", entity.uid);
		return entity;
	},
	
	save: function(uid) {
		if(!UidManager.entities[uid]) {
			console.error("UidManager.save(): #" + uid + " does not appear to be loaded, so it couldn't be saved.");
			return false;
		}
		console.log("UidManager.save(): #" + uid + " saved.");
		serverStorage.setItem(uid.toString(), UidManager.entities[uid]);
	}
}
