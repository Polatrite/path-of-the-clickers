var Affix = require(appRoot + '/shared/Affix.js');
var AffixType = require(appRoot + '/shared/AffixType.js');
var StatRange = require(appRoot + '/shared/StatRange.js');

var AffixData = {
	stats: {},
	inLevelRangeAffixes: [],
	inOrBelowLevelRangeAffixes: [],
	
	inOrBelowLevelRangeWeightedAffixes: [],

	pickRandomAffix: function(level) {
		return this.inOrBelowLevelRangeAffixes[level].pick();
	}
};
AffixData.inLevelRangeAffixes[100] = undefined;

var AffixGenerator = function(conf) {
	var self = this;
	this.name = "Debugging";
	this.type = "primary";
	this.numTiers = 12;

	this.statGens = [];
	
	this.levelMin = 1;
	this.levelMax = 100;
	this.levelGrowth = linearLevelGrowth;

	this.generate = function() {
		var affixes = [];
		var affix;

		for(var i = 1; i <= self.numTiers; i++) {
			affix = new AffixType({
				name: self.name,
				type: self.type,
				tier: i,
				levelMin: self.levelGrowth(self, i-1),
				levelMax: self.levelGrowth(self, i)-1
			});
			if(i == 1) {
				affix.levelMin = self.levelMin;
			}
			if(i == self.numTiers) {
				affix.levelMax = self.levelMax;
			}

			_.each(self.statGens, function(statGen) {
				affix.statRanges.push(statGen.statGrowth(statGen, i));
			});

			affixes.push(affix);
		}

		return affixes;
	}

	_.extend(this, conf);
}

function linearLevelGrowth(self, tier) {
	return Math.floor(((self.levelMax -self.levelMin) / self.numTiers * tier) + self.levelMin);
}

// requires 12 tiers right now
function highScalingStatGrowth(self, tier) {
	var statRange = new StatRange({
		stat: self.stat
	});

	var multi = 2.00;
	var stepDown = 0.08;

	if(self.numTiers == 9) stepDown = 0.035;
	if(self.numTiers == 10) stepDown = 0.060;
	if(self.numTiers == 12) stepDown = 0.080;
	if(self.numTiers == 14) stepDown = 0.085;

	var min = self.minLowest;
	var max = self.maxLowest;
	for(var i = 1; i < tier; i++) {
		min = min * multi;
		max = max * multi;
		multi -= stepDown;
	}

	statRange.min = Math.floor(min);
	statRange.max = Math.floor(max);

	return statRange;
}

function linearStatGrowth(self, tier) {
	var statRange = new StatRange({
		stat: self.stat,
		min: Math.floor(((self.minHighest - self.minLowest) / (self.numTiers-1) * (tier-1)) + self.minLowest),
		max: Math.floor(((self.maxHighest - self.maxLowest) / (self.numTiers-1) * (tier-1)) + self.maxLowest)
	});

	return statRange;
}


var StatGenerator = function(conf) {
	var self = this;
	this.numTiers = 12;
	this.stat = "";
	this.minLowest = 0;
	this.minHighest = 0;
	this.maxLowest = 0;
	this.maxHighest = 0;
	this.statGrowth = highScalingStatGrowth;

	_.extend(this, conf);
}

var attackMin = 5;
var attackMax = 6.5;
var defenseMin = 3.33;
var defenseMax = 4.33;

AffixData.stats.attack = new AffixGenerator({
	name: "Attack Damage",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "attack",
			numTiers: 12,
			minLowest: attackMin,
			maxLowest: attackMax,
		})
	]
}).generate();

AffixData.stats.magic = new AffixGenerator({
	name: "Magic Damage",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "attack",
			numTiers: 12,
			minLowest: attackMin,
			maxLowest: attackMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.hp = new AffixGenerator({
	name: "Health",
	type: "primary",
	numTiers: 14,
	levelMin: 1,
	levelMax: 80,
	statGens: [
		new StatGenerator({
			stat: "hp",
			numTiers: 14,
			minLowest: defenseMin*3,
			maxLowest: defenseMax*3,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.defense = new AffixGenerator({
	name: "Defense",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "defense",
			numTiers: 12,
			minLowest: defenseMin,
			maxLowest: defenseMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.resist = new AffixGenerator({
	name: "Resist",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "resist",
			numTiers: 12,
			minLowest: defenseMin,
			maxLowest: defenseMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.evade = new AffixGenerator({
	name: "Evade",
	type: "primary",
	numTiers: 12,
	levelMin: 13,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "evade",
			numTiers: 12,
			minLowest: defenseMin,
			maxLowest: defenseMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.fortitude = new AffixGenerator({
	name: "Fortitude",
	type: "primary",
	numTiers: 12,
	levelMin: 20,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "fortitude",
			numTiers: 12,
			minLowest: defenseMin,
			maxLowest: defenseMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.deflection = new AffixGenerator({
	name: "Deflection",
	type: "primary",
	numTiers: 12,
	levelMin: 20,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "deflection",
			numTiers: 12,
			minLowest: defenseMin,
			maxLowest: defenseMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.bane = new AffixGenerator({
	name: "Bane",
	type: "primary",
	numTiers: 12,
	levelMin: 20,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "bane",
			numTiers: 12,
			minLowest: attackMin,
			maxLowest: attackMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.boon = new AffixGenerator({
	name: "Boon",
	type: "primary",
	numTiers: 12,
	levelMin: 20,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "boon",
			numTiers: 12,
			minLowest: attackMin,
			maxLowest: attackMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.vigor = new AffixGenerator({
	name: "Vigor",
	type: "primary",
	numTiers: 12,
	levelMin: 20,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "vigor",
			numTiers: 12,
			minLowest: attackMin,
			maxLowest: attackMax,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.threat = new AffixGenerator({
	name: "Threat",
	type: "primary",
	numTiers: 8,
	levelMin: 20,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "accuracy",
			numTiers: 8,
			minLowest: 10,
			minHighest: 16,
			maxLowest: 230,
			maxHighest: 250,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.attackSpeed = new AffixGenerator({
	name: "Attack Speed",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "attackSpeed",
			numTiers: 16,
			minLowest: 6,
			minHighest: 52,
			maxLowest: 8,
			maxHighest: 58,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.magic = new AffixGenerator({
	name: "Magic Damage & Cooldown Acceleration",
	type: "primary",
	numTiers: 12,
	levelMin: 18,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "magic",
			numTiers: 12,
			minLowest: attackMin*0.6,
			maxLowest: attackMax*0.6,
			statGrowth: highScalingStatGrowth
		}),
		new StatGenerator({
			stat: "cooldownAcceleration",
			numTiers: 12,
			minLowest: 4,
			minHighest: 23,
			maxLowest: 6,
			maxHighest: 29,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.cooldownAcceleration = new AffixGenerator({
	name: "Cooldown Acceleration",
	type: "primary",
	numTiers: 8,
	levelMin: 10,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "cooldownAcceleration",
			numTiers: 8,
			minLowest: 8,
			minHighest: 46,
			maxLowest: 12,
			maxHighest: 58,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.accuracy = new AffixGenerator({
	name: "Accuracy",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "accuracy",
			numTiers: 6,
			minLowest: 4,
			minHighest: 36,
			maxLowest: 8,
			maxHighest: 40,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.attackAccuracy = new AffixGenerator({
	name: "Attack Damage & Accuracy",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "attack",
			numTiers: 12,
			minLowest: attackMin*0.6,
			maxLowest: attackMax*0.6,
		}),
		new StatGenerator({
			stat: "accuracy",
			numTiers: 12,
			minLowest: 2,
			minHighest: 18,
			maxLowest: 5,
			maxHighest: 20,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.critChance = new AffixGenerator({
	name: "Critical Chance",
	type: "primary",
	numTiers: 6,
	levelMin: 16,
	levelMax: 90,
	statGens: [
		new StatGenerator({
			stat: "critChance",
			numTiers: 6,
			minLowest: 4,
			minHighest: 30,
			maxLowest: 8,
			maxHighest: 34,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.critDamage = new AffixGenerator({
	name: "Critical Damage",
	type: "primary",
	numTiers: 6,
	levelMin: 44,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "critDamage",
			numTiers: 6,
			minLowest: 15,
			minHighest: 85,
			maxLowest: 25,
			maxHighest: 100,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.defensePenetration = new AffixGenerator({
	name: "Defense Penetration",
	type: "primary",
	numTiers: 4,
	levelMin: 50,
	levelMax: 82,
	statGens: [
		new StatGenerator({
			stat: "defensePenetration",
			numTiers: 4,
			minLowest: 10,
			minHighest: 30,
			maxLowest: 12,
			maxHighest: 34,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.lifesteal = new AffixGenerator({
	name: "Lifesteal",
	type: "primary",
	numTiers: 10,
	levelMin: 8,
	levelMax: 100,
	statGens: [
		new StatGenerator({
			stat: "lifesteal",
			numTiers: 10,
			minLowest: 1,
			minHighest: 10,
			maxLowest: 1.5,
			maxHighest: 12,
			statGrowth: linearStatGrowth
		})
	]
}).generate();

AffixData.stats.recovery = new AffixGenerator({
	name: "Recovery",
	type: "primary",
	numTiers: 12,
	levelMin: 1,
	levelMax: 80,
	statGens: [
		new StatGenerator({
			stat: "recovery",
			numTiers: 12,
			minLowest: defenseMin*0.4,
			maxLowest: defenseMax*0.66,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

AffixData.stats.perseverance = new AffixGenerator({
	name: "Perseverance",
	type: "primary",
	numTiers: 12,
	levelMin: 10,
	levelMax: 86,
	statGens: [
		new StatGenerator({
			stat: "perseverance",
			numTiers: 12,
			minLowest: defenseMin*0.2,
			maxLowest: defenseMax*0.33,
			statGrowth: highScalingStatGrowth
		})
	]
}).generate();

function buildAllAffixes() {
	_.each(AffixData.stats, function(statList) {
		_.each(statList, function(stat) {
			for(var i = stat.levelMin; i <= stat.levelMax; i++) {
				if(!AffixData.inLevelRangeAffixes[i]) {
					AffixData.inLevelRangeAffixes[i] = [];
				}
				AffixData.inLevelRangeAffixes[i].push(stat);
			}

			for(var i = stat.levelMin; i <= 100; i++) {
				if(!AffixData.inOrBelowLevelRangeAffixes[i]) {
					AffixData.inOrBelowLevelRangeAffixes[i] = [];
				}
				AffixData.inOrBelowLevelRangeAffixes[i].push(stat);
			}
		});
	});
}
buildAllAffixes();

var now = new Date();
var chosen = {};
for(var i = 0; i <= 2100000; i++) {
	var affixType = AffixData.pickRandomAffix(60);
	if(!chosen[affixType.name])
		chosen[affixType.name] = 0;
	chosen[affixType.name] += 1;
}

console.log(chosen);

module.exports = AffixData;