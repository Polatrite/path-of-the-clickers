var uidManager = require(appRoot + '/shared/UidManager.js');

var Inventory = function(size, location, conf) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Inventory',

		name: 'Generic Inventory',
		items: [],
		location: location.uid,
		size: size,
		whitelist: [],
		blacklist: [],
		
		itemMovedCallback: function(inventory, item, action) {}
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
		newIndex = this.getEmptySlot();
	}
	if(newIndex == -1) {
		console.error("Inventory is full.");
		return false;
	}
	console.error("MOVE: Item [" + item.itemType + "] enter Inventory [" + this.whitelist + "-" + this.blacklist + "]");
	if(!this.checkItemFilter(item)) {
		console.error("Item [" + item.itemType + "] cannot enter Inventory [" + this.whitelist + "-" + this.blacklist + "]");
		return false;
	}

	item.location = this.uid;
	item.locationIndex = newIndex;
	this.items[newIndex] = item;

	this.itemMovedCallback(this, item, 'added');

	return true;
}

Inventory.prototype.removeItem = function(item) {
	var found = this.items.removeUid(item.uid);

	if(!found) {
		console.error("Tried to remove an item from " + this.name + " but it doesn't exist.");
		return false;
	}
	
	this.itemMovedCallback(this, item, 'removed');
	
	item.location = null;
	item.locationIndex = -1;
	return true;
}

Inventory.prototype.checkItemFilter = function (item) {
	var that = this;
    for (var index = 0; index < that.blacklist.length; index++) {
        var blacklist_tag = that.blacklist[index];
        for (var item_index = 0; item_index < item.itemType.length; item_index++) {
            var item_tag = item.itemType[item_index];
            if (item_tag == blacklist_tag) return false;
        }
    }

    var needed_tag_size = that.whitelist.length;
    var tag_hits = 0;

    for (var index = 0; index < that.whitelist.length; index++) {
        var whitelist_tag = that.whitelist[index];
        for (var item_index = 0; item_index < item.itemType.length; item_index++) {
            var item_tag = item.itemType[item_index];
            if (item_tag == whitelist_tag) tag_hits++;
        }
    }

    return needed_tag_size == tag_hits;
}

Inventory.prototype.getEmptySlot = function () {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] == undefined) {
        	return i;
        }
    }

    return -1;
}

module.exports = Inventory;