var _ = require('underscore');

var Affix = function(conf) {
	this.entityType = 'Affix';
	this.name = "Debugging";
	this.type = "primary";
	this.stats = {};
	this.location = null;

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
}

module.exports = Affix;
