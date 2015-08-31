var express = require('express');
var paperwork = require('paperwork');

var uidManager = require(appRoot + '/server/UidManager.js');

var router = express.Router();

router.post('/equip', paperwork.accept({
	itemUid: String,
	minionUid: String
}), function(req, res) {
	var minion = uidManager.get(req.body.minionUid);
	var item = uidManager.get(req.body.itemUid);

	if(!minion) {
		res.send("Minion could not be found", 500);
		return;
	}
	if(!item) {
		res.send("Item could not be found", 500);
		return;
	}
	
	var result = item.equipOn(minion);
	if(!result) {
		res.send("Cannot equip that item.", 500);
		return;
	}
	
	res.send(200);
});

console.log('Initialized routes');

module.exports = router;