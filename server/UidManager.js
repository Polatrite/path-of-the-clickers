var serverStorage = require('node-persist');

var UidManager = {
	currentUid: serverStorage.getItem('UidManager') || 100000
}

module.exports = {
	next: function() {
		UidManager.currentUid++;
		serverStorage.setItem('UidManager', UidManager.currentUid);
		return UidManager.currentUid;
	},
	current: function() {
		return UidManager.currentUid;
	}
}
