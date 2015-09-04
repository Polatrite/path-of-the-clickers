var uidManager = require(appRoot + '/shared/UidManager.js');

var Inventory = function(size, location, conf) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Inventory',

		name: 'Generic Inventory',
		items: [],
		location: location.uid
	});
	
	this.items[size-1] = undefined; // initialize array length
	
	_.extend(this, conf);
}

Inventory.prototype.addItem = function(item, newIndex) {
	if(this.items.includes(item)) {
		console.error("Tried to add an item to " + this.name + " that is already in it.");
		return false;
	}
	if(newIndex === undefined || newIndex == -1) {
		console.log("Get empty slot");
		newIndex = this.getEmptySlot();
		console.log("Get empty slot", newIndex);
	}
	if(newIndex == -1) {
		console.error("Inventory is full.");
		return false;
	}

	item.location = this.uid;
	item.locationIndex = newIndex;
	this.items[newIndex] = item;
	console.log("addItem() finished");

	return true;
}

Inventory.prototype.removeItem = function(item) {
	if(!this.items.includes(item)) {
		console.error("Tried to remove an item from " + this.name + " but it doesn't exist.");
		return false;
	}
	
	this.items.remove(item);
	item.location = null;
	item.locationIndex = -1;
	return true;
}

Inventory.prototype.getEmptySlot = function () {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] == undefined) {
        	return i;
        	console.log("getEmptySlot() returns " + i);
        }
    }

    return -1;
}

module.exports = Inventory;