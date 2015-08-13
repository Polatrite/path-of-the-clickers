var AffixTypes = {
	"primary": "primary",
	"secondary": "secondary",
	"utility": "utility"
};

var Affix = function(conf) {
	this.name = "Debugging";
	this.type = "primary";
	this.stats = {};

	_.extend(this, conf);
};

Affix.prototype.apply = function(monster) {
	if(monster.affixes.includes(this)){
		console.error(monster.name + " already affected by " + this.name);
		return;
	}

	monster.affixes.push(this);

	_.each(this.stats, function(value, stat) {
		if(stat in monster) {
			monster[stat] += value;
		}
	});
}

Affix.prototype.remove = function(monster) {
	_.each(this.stats, function(value, stat) {
		if(stat in monster) {
			monster[stat] -= value;
		}
	});
}


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

var StatRange = function(conf) {
	this.stat = "";
	this.min = 0;
	this.max = 1;

	_.extend(this, conf);
}

StatRange.prototype.pick = function() {
	return randInt(this.min, this.max);
}

var primaryAffixes = {
	attack: [
		new AffixType({
			name: "Damage",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 3,
					max: 8
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
		new AffixType({
			name: "Damage+",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 8,
					max: 14
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
		new AffixType({
			name: "Damage++",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 15,
					max: 23
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
		new AffixType({
			name: "Damage+++",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 25,
					max: 35
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
	]
}
