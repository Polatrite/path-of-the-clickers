var uidManager = require(appRoot + '/shared/UidManager.js');

var Minion = function(conf) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Minion',
		
		name: "",
		description: "",
		image: "",
		
		level: 1,
		exp: 0,
		starRank: 1,
		prestige: 0,
		
		permanentStats: {
			hp: 5,
			maxhp: 5,
			defense: 0,
			resist: 0,
			evade: 0,
			fortitude: 0,
			deflection: 0,
			
			bane: 0,
			boon: 0,
			vigor: 0,
			threat: 0,
	
			attack: 1,
			magic: 1,
			attackSpeed: 1000,
			cooldownAcceleration: 0,
			critChance: 0,
			critDamage: 0,
			accuracy: 0,
			defensePenetration: 0,
	
			lifesteal: 0,
			recovery: 0,
			perseverance: 0
		},
		
		tempStats: {
			
		},

		elements: [],
		
		prestigeStats: {
			
		},

		equipment: {
			weapon: null,
			trinket: null,
			amulet: null
		},
		
		behavior: {
			
		}
		
	})
	
	_.extend(this, conf);
}

Minion.prototype.getMaxLevel = function() {
	return this.starRank * 20;
}

Minion.prototype.takeDamage = function(attacker, damage) {
	this.health = Math.max()

	return true;
}

Minion.prototype.resetCombatStats = function() {
	this.combatStats = {};
	_.extend(this.combatStats, this.permanentStats);
	return this.combatStats;
}

Minion.prototype.addStats = function(stats, myStats) {
	var minion = this;
	_.each(stats, function(value, stat) {
		if(value == 0) { return; }
		if(stat in myStats) {
			console.log(minion.toDebugString() + " " + stat + " increased from " + myStats[stat] + " to " + (myStats[stat] + value));
			myStats[stat] += value;
		}
	});

	return true;
}

Minion.prototype.removeStats = function(stats, myStats) {
	var minion = this;
	_.each(stats, function(value, stat) {
		if(value == 0) { return; }
		if(stat in myStats) {
			console.log(minion.toDebugString() + " " + stat + " decreased from " + myStats[stat] + " to " + (myStats[stat] - value));
			myStats[stat] -= value;
		}
	});

	return true;
}

module.exports = Minion;