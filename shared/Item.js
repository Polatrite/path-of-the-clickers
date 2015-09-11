var changeCase = require('change-case')

var uidManager = require(appRoot + '/shared/UidManager.js');
var BaseItems = require(appRoot + '/game-data/BaseItems.js');
var CurrencyItems = require(appRoot + '/game-data/CurrencyItems.js');
var AffixData = require(appRoot + '/game-data/AffixData.js');

var ItemQualities = {
	'shoddy': {
		name: 'shoddy',
		level: 1,
		primaryAffixes: 1
	},
	'ordinary': {
		name: 'ordinary',
		level: 2,
		primaryAffixes: 2
	},
	'uncommon': {
		name: 'uncommon',
		level: 3,
		primaryAffixes: 3
	},
	'rare': {
		name: 'rare',
		level: 4,
		primaryAffixes: 4
	},
	'enchanted': {
		name: 'enchanted',
		level: 5,
		primaryAffixes: 5
	},
	'masterwork': {
		name: 'masterwork',
		level: 6,
		primaryAffixes: 6
	},
	'ultimate': {
		name: 'ultimate',
		level: 7,
		primaryAffixes: 7
	},
	'mythic': {
		name: 'mythic',
		level: 8,
		primaryAffixes: 8
	},
	'godly': {
		name: 'godly',
		level: 9,
		primaryAffixes: 9
	}
};

function Item(cfg) {
	_.extend(this, {
		uid: uidManager.next(this),
		entityType: 'Item',
		
		baseItem: null,
		
		name: '',
		description: '',
		tooltip: '',
		
		itemType: ['item'],
		
		spritesheet: 'img/items.png',
		spriteX: 0,
		spriteY: 0,
		
		equipmentSlot: '',
		
		level: 1,
		quality: 'shoddy',
		_quality: ItemQualities['shoddy'],
		
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
			magic: 0,
			attackSpeed: 0,
			cooldownAcceleration: 0,
			critChance: 0,
			critDamage: 0,
			accuracy: 0,
			defensePenetration: 0,
	
			lifesteal: 0,
			recovery: 0,
			perseverance: 0
		},

		usable: false,
		useTargets: [],
		useAction: null,
		
		location: null,
		locationIndex: -1,
		equipped: null
		
	});
	
	if(cfg && cfg.baseItem) {
		this.applyBaseItem(cfg.baseItem);
	}

	_.extend(this, cfg);
	
	this.applyQuality(this.quality, true);
	this.getTooltip();
}

Item.prototype.getTooltip = function() {
	var self = this;
	this.tooltip = strf("<h2 class='item-quality-[quality]'>[name]</h2>Level [level] [quality] [itemType[itemType.length-1]]<br>", this);
	
	_.each(this.stats, function(value, stat) {
		if(value) {
			self.tooltip += value + " " + changeCase.titleCase(stat) + "<br>";
		}
	});

	_.each(this.affixes.primary, function(affix) {
		self.tooltip += affix.toDisplayString("html");
	});
	
	return this.tooltip;
}

Item.prototype.applyQuality = function(quality, adjustAffixes) {
	var self = this;
	self.quality = quality;
	self._quality = ItemQualities[quality];

	if(adjustAffixes && self.itemType.includes('equipment')) {
		if(self.affixes.primary.length < self._quality.primaryAffixes) {
			for(var i = self.affixes.primary.length; i < self._quality.primaryAffixes; i++) {
				var loops = 0;
				var affixType = null;
				while(!affixType) {
					loops++;
					if(loops >= MAX_RENEGADE_LOOPS) {
						console.error("INFINITE LOOP DETECTED", new Error());
						break;
					}
					affixType = AffixData.pickRandomAffix(self.level);
					if(self.hasAffix(affixType.name)) {
						affixType = null;
					}
				}
				var affix = affixType.createAffix();
				affix.apply(this);
			}
		}
	}

	return true;
}

Item.prototype.hasAffix = function(affixName) {
	for(var i = 0; i < this.affixes.primary.length; i++) {
		if(this.affixes.primary[i].name === affixName) {
			return true;
		}
	}
	return false;
}

Item.prototype.applyBaseItem = function(type) {
	console.log("applyBaseItem() " + type, BaseItems[type]);
	if(BaseItems[type] === undefined) {
		return false;
	}
		
	_.extend(this, BaseItems[type]);
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
	this.location = minion.uid;
	this.equipped = this.equipmentSlot;

	console.log(minion.toDebugString() + " equipped " + this.toDebugString());
	return true;
}

Item.prototype.unequip = function() {
	var minion = $E(this.location);
	if(!minion) {
		console.error(this.toDebugString() + " is not equipped.");
		return false;
	}
	
	minion.removeStats(this.stats, minion.permanentStats);
	minion.equipment[this.equipmentSlot] = null;
	this.location = null;
	this.equipped = null;

	console.log(minion.toDebugString() + " unequipped " + this.toDebugString());
	return true;
}

Item.prototype.move = function(newLocation, newIndex) {
	if(this.equipped) {
		this.unequip();
	}
	if(this.location) {
		console.log(strf("Removed [name] [entityType]", this));
		$E(this.location).removeItem(this);
	}

	if(newLocation.entityType === 'Player') {
		var player = newLocation;
		console.log(strf("Added [name] [entityType]", this));
		player.inventory.addItem(this, newIndex);
		console.log(this.toDebugString() + " moved to " + player.toDebugString() + ".");
	}
	if(newLocation.entityType === 'Inventory') {
		var inventory = newLocation;
		inventory.addItem(this, newIndex);
		console.log(this.toDebugString() + " moved to " + inventory.toDebugString() + ".");
	}
	
	return true;
}

Item.prototype.addStats = function(stats) {
	var item = this;
	console.log("Stats", stats);
	_.each(stats, function(value, stat) {
		if(value == 0) { return; }
		if(stat in item.stats) {
			console.log(item.toDebugString() + " " + stat + " increased from " + item.stats[stat] + " to " + (item.stats[stat] + value));
			item.stats[stat] += value;
		} else {
			item.stats[stat] = value;
		}
	});
	
	var minion = $E(this.location);
	if(minion) {
		minion.addStats(stats, minion.permanentStats);
	}

	this.getTooltip();

	return true;
}

Item.prototype.removeStats = function(stats) {
	var item = this;
	_.each(stats, function(value, stat) {
		if(value == 0) { return; }
		if(stat in item.stats) {
			console.log(item.toDebugString() + " " + stat + " decreased from " + item.stats[stat] + " to " + (item.stats[stat] - value));
			item.stats[stat] -= value;
		} else {
			console.error(item.toDebugString() + " tried to decrease " + stat + " but doesn't have it!");
			return false
		}
	});

	var minion = $E(this.location);
	if(minion) {
		minion.removeStats(stats, minion.permanentStats);
	}

	this.getTooltip();

	return true;
}

Item.prototype.use = function(target) {
	var item = this;
	if(!item.usable) {
		console.error("Item is not usable");
		return false;
	}
	if(item.location !== target.location) {
		console.error("Item and target are not in the same location");
		return false;
	}

	if(target.entityType === 'Item') {
		var valid = false;
		_.each(target.itemType, function(itemType) {
			if(item.useTargets.includes(itemType)) {
				valid = true;
			}
		});
		if(!valid) {
			console.error("Item is not usable on target");
			return false;
		}

		item.useAction(target);
	}
}

module.exports = Item;