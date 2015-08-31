var uidManager = require(appRoot + '/server/UidManager.js');

var Affix = function(conf) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Affix',
		
		name: "Debugging",
		type: "primary",
		stats: {},
		location: null
	})

	_.extend(this, conf);
};

Affix.prototype.apply = function(item) {
	var affixArray = null;
	if(this.type === 'primary') {
		affixArray = item.affixes.primary;
	} else if(this.type === 'utility') {
		affixArray = item.affixes.utility;
	}
	if(affixArray.includes(this)){
		console.error(item.toDebugString() + " already affected by " + this.toDebugString());
		return;
	}

	affixArray.push(this);
	this.location = item;
	item.addStats(this.stats);

	console.log("Applied " + this.toDebugString() + " to " + item.toDebugString());

	return true;
}

Affix.prototype.unapply = function() {
	var item = this.location;
	if(!item) {
		console.error(this.toDebugString() + " is not applied.");
		return false;
	}

	var affixArray = null;
	if(this.type === 'primary') {
		affixArray = item.affixes.primary;
	} else if(this.type === 'utility') {
		affixArray = item.affixes.utility;
	}

	affixArray.remove(this);
	item.removeStats(this.stats);
	this.location = null;

	console.log("Unapplied " + this.toDebugString() + " from " + item.toDebugString());

	return true;
}

module.exports = Affix;
