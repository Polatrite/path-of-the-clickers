var UidManager = require(appRoot + '/shared/UidManager.js');

module.exports = function(uid, entityType) {
	var entity = UidManager.get(uid);
	if(entityType) {
		if(entity && entity.entityType === entityType) {
			return entity;
		} else {
			return null;
		}
	}
	return entity;
};
