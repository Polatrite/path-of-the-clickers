var _ = require('underscore');

var AffixType = function(conf) {
	this.name = "Debugging";
	this.type = "primary";
	this.statRanges = [];
	this.levelMin = 0;
	this.levelMax = 100;

	_.extend(this, conf);
}

AffixType.prototype.create = function() {
	var self = this;
	var affix = new Affix({
		name: this.name,
		type: this.type
	});

	_.each(this.statRanges, function(statRange) {
		affix.stats[statRange.stat] = statRange.pick();
	});

	return affix;
}

module.exports = AffixType;