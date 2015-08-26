var _ = require('underscore');

var Minion = function(conf) {
	_.extend(this, {
		name: "",
		description: "",
		image: "",
		
		level: 1,
		exp: 0,
		starRank: 1,
		prestige: 0,
		
		hp: 5,
		maxhp: 5,
		potency: 0,
		vigor: 0,
		
		attack: 1,
		attackCritical: 0,
		attackSpeed: 1000,
		attackPenetration: 0,
		arcana: 1,
		arcanaCritical: 0,
		arcanaCritDamage: 0,

		defense: 0,
		resistance: 0,
		deflect: 0,
		absorb: 0,

		attackLifesteal: 0,
		arcanaLifesteal: 0,
		healthRegen: 0,
		healthConst: 0,

		elements: [],
		cooldownSpeed: 100,

		prestigeStats: {
			
		},

		affixes: [],

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
	return starRank * 20;
}

Minion.prototype.takeDamage = function(attacker, damage) {
	this.health = Math.max()
}

module.exports = Minion;