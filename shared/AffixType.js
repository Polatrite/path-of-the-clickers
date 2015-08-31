var Affix = require(appRoot + '/shared/Affix.js');

var AffixType = function(conf) {
	this.entityType = 'AffixType';
	this.name = "Debugging";
	this.type = "primary";
	this.statRanges = [];
	/*  [{
			stat: {
				min: 3,
				max: 8
			}
		}]*/
	this.levelMin = 0;
	this.levelMax = 100;
	this.levelThresholds = { }

	_.extend(this, conf);
}

AffixType.prototype.createAffix = function() {
	var self = this;
	var affix = new Affix({
		name: this.name,
		type: this.type
	});

	_.each(this.statRanges, function(statRange, stat) {
		affix.stats[stat] = Math.randInt(statRange.min, statRange.max);
	});
	
	console.log("Created a new affix instance: ", affix);

	return affix;
}

module.exports = AffixType;