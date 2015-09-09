var express = require('express');
var paperwork = require('paperwork');

var uidManager = require(appRoot + '/shared/UidManager.js');
var Item = require(appRoot + '/shared/Item.js');
var BaseItem = require(appRoot + '/shared/BaseItem.js');

var router = express.Router();

router.post('/move', paperwork.accept({
	playerUid: Number,
	itemUid: Number,
	fromUid: Number,
	fromIndex: Number,
	toUid: Number,
	toIndex: Number
}), function(req, res) {
	var player = uidManager.get(req.body.playerUid);
	var item = uidManager.get(req.body.itemUid);
	var oldLocation = uidManager.get(req.body.fromUid);
	var newLocation = uidManager.get(req.body.toUid);
	
	console.log(req.body, newLocation);
	
	if(item.location != oldLocation.uid ) {
		res.send("Item's old location is incorrect", 660); //resync
		return;
	} else if(item.locationIndex != req.body.fromIndex) {
		res.send("Item's old location index is incorrect", 660);
		return;
	}
	
	item.move(newLocation, req.body.toIndex);
	player.save();
	res.send(200);
});

router.post('/craft', paperwork.accept({
	playerUid: Number,
	baseItem: String,
	components: [Number]
}), function(req, res) {
	var player = uidManager.get(req.body.playerUid);
	var baseItemType = req.body.baseItem;
	
	if(!player) {
		res.send("Player could not be found", 500);
	}
	if(BaseItem[baseItemType] === undefined) {
		res.send("Invalid base item type", 500);
		return;
	}
	
	var item = new Item({
		baseItem: baseItemType,
		quality: ['normal', 'uncommon', 'magic', 'rare'].pick()
	});
	console.log(item.tooltip);
	item.move(player.inventory);
	
	res.send({
		inventory: player.inventory,
		item: item
	});
});

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