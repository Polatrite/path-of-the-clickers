var uidManager = require(appRoot + '/shared/UidManager.js');

module.exports = function(uid) {
	return uidManager.get(uid);
};
