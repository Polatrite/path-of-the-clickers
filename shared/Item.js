var uidManager = require(appRoot + '/server/UidManager.js');

function Item(cfg) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Item',
		
		name: '',
		description: '',
		tooltip: '',
		
		equipmentSlot: '',
		
		affixes: {
			primary: [],
			utility: []
		},
		
		stats: {
			hp: 0,
			maxhp: 0,
			defense: 0,
			resist: 0,
			evade: 0,
			fortitude: 0,
			deflection: 0,
			
			bane: 0,
			boon: 0,
			vigor: 0,
			threat: 0,
	
			attack: 0,
			attackSpeed: 0,
			cooldownReduction: 0,
			critChance: 0,
			critDamage: 0,
			accuracy: 0,
			defensePenetration: 0,
	
			lifesteal: 0,
			recovery: 0,
			perseverance: 0
		},
		
		location: null
		
	});

	_.extend(this, cfg);
}

Item.prototype.equipOn = function(minion) {
	if(minion.equipment[this.equipmentSlot] != null){
		console.error(minion.toDebugString() + " already equipping a " + this.equipmentSlot);
		return false;
	}
	
	if(this.location != null) {
		console.error("This is already equipped on " + this.toDebugString());
		return false;
	}

	minion.addStats(this.stats, minion.permanentStats);
	minion.equipment[this.equipmentSlot] = this;
	this.location = minion;

	console.log(minion.toDebugString() + " equipped " + this.toDebugString(), minion);
	return true;
}

Item.prototype.unequip = function() {
	var minion = this.location;
	if(!minion) {
		console.error(this.toDebugString() + " is not equipped.");
		return false;
	}
	
	minion.removeStats(this.stats, minion.permanentStats);
	minion.equipment[this.equipmentSlot] = null;
	this.location = null;

	console.log(minion.toDebugString() + " unequipped " + this.toDebugString());
	return true;
}

Item.prototype.addStats = function(stats) {
	var item = this;
	_.each(stats, function(value, stat) {
		if(value == 0) { return; }
		if(stat in item.stats) {
			console.log(item.toDebugString() + " " + stat + " increased from " + item.stats[stat] + " to " + (item.stats[stat] + value));
			item.stats[stat] += value;
		}
	});
	
	var minion = this.location;
	if(minion) {
		minion.addStats(stats, minion.permanentStats);
	}

	return true;
}

Item.prototype.removeStats = function(stats) {
	var item = this;
	_.each(stats, function(value, stat) {
		if(value == 0) { return; }
		if(stat in item.stats) {
			console.log(item.toDebugString() + " " + stat + " decreased from " + item.stats[stat] + " to " + (item.stats[stat] - value));
			item.stats[stat] -= value;
		}
	});

	var minion = this.location;
	if(minion) {
		minion.removeStats(stats, minion.permanentStats);
	}

	return true;
}

module.exports = Item;