var Affix = require(appRoot + '/shared/Affix.js');

var AffixType = function(conf) {
	this.entityType = 'AffixType';
	this.name = "Debugging";
	this.type = "primary";
	this.tier = -1;
	this.statRanges = [];
	this.levelMin = 0;
	this.levelMax = 100;

	_.extend(this, conf);
}

AffixType.prototype.createAffix = function() {
	var self = this;
	var affix = new Affix({
		name: self.name,
		type: self.type,
		tier: self.tier
	});

	_.each(self.statRanges, function(statRange, stat) {
		affix.stats[statRange.stat] = Math.randInt(statRange.min, statRange.max);
	});
	
	console.log("Affix created", affix);
	return affix;
}

AffixType.prototype.toDisplayString = function(type) {
	if(type == "short") {
		return strf("[name] ([levelMin]-[levelMax])", this);
	}
}

module.exports = AffixType;