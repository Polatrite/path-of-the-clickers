var spritesheet = 'img/items.png';

var BaseItems = {
	'GlassShard': {
		name: 'Glass Shard',

		itemType: ['item', 'weapon', 'dagger'],
		
		spritesheet: spritesheet,
		spriteX: 1,
		spriteY: 6,
		
		stats: {
			attack: 5, // 49 dps
			attackSpeed: 140,
			critChance: 7,
		}
	},
	'WoodenSword': {
		name: 'Wooden Sword',

		itemType: ['item', 'weapon', 'sword'],
		
		spritesheet: spritesheet,
		spriteX: 0,
		spriteY: 5,
		
		stats: {
			attack: 8, // 48 dps
			attackSpeed: 120,
			critChance: 5,
		}
	},
	'BasicHatchet': {
		name: 'Basic Hatchet',

		itemType: ['item', 'weapon', 'axe'],
		
		spritesheet: spritesheet,
		spriteX: 0,
		spriteY: 10,
		
		stats: {
			attack: 11, // 49 dps
			attackSpeed: 100,
			critChance: 5,
		}
	},
	'CrudeBow': {
		name: 'Crude Bow',

		itemType: ['item', 'weapon', 'bow'],
		
		spritesheet: spritesheet,
		spriteX: 0,
		spriteY: 11,
		
		stats: {
			attack: 12, // 49 dps
			attackSpeed: 90,
			critChance: 5,
		}
	}
}

module.exports = BaseItems;