var UidManager = require(appRoot + '/shared/UidManager.js');

module.exports = function(uid) {
	return UidManager.get(uid);
};
