var Monster = function(conf) {
	_.extend(this, {
		level: 1,
		exp: 0,
		starRank: 1,
		prestige: 0,
		hp: 5,
		maxhp: 5,
		physAttack: 1,
		physDefense: 1,
		magAttack: 1,
		magDefense: 1,
		elements: [],
		attackSpeed: 100,
		cooldownSpeed: 100,
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

Monster.prototype.getMaxLevel = function() {
	return starRank * 20;
}

Monster.prototype.takeDamage = function(attacker, damage) {
	this.health = Math.max()
}

