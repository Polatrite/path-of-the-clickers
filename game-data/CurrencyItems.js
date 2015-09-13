var BaseItems = require(appRoot + '/game-data/BaseItems.js');

var CurrencyItems = {
	'BreakingScroll': {
		name: 'Breaking Scroll',
		description: "Destroy an item to pull a specific affix out of it, creating an Enchantment Scroll with that affix.",

		itemType: ['item', 'scroll'],
		quality: 'uncommon',

		usable: true,
		useTargets: ['equipment'],
		useAction: function(target) {
			console.log("Used " + this.name + " on " + target.name);
		},
		consumeOnUse: true,
		
		spriteX: 0,
		spriteY: 15,
	},
	'ScrollAlteration': {
		name: 'Scroll of Alteration',
		description: "Randomize the affixes on an item with rarity: ordinary, uncommon, rare",

		itemType: ['item', 'scroll'],
		quality: 'ordinary',

		usable: true,
		useTargets: ['equipment'],
		useAction: function(target) {
			var validQualities = ['ordinary', 'uncommon', 'rare'];
			console.log("Used " + this.name + " on " + target.name);
			if(!validQualities.includes(target.quality)) {
				return false;
			}

			target.clearAffixes();
			target.createMissingAffixes();

			return true;
		},
		consumeOnUse: true,
		
		spriteX: 0,
		spriteY: 15,
	},
	'ScrollEnchantment': {
		name: 'Scroll of Enchantment',
		description: "Randomize the affixes on an item with rarity: enchanted, masterwork, ultimate, mythic",

		itemType: ['item', 'scroll'],
		quality: 'enchanted',

		usable: true,
		useTargets: ['equipment'],
		useAction: function(target) {
			var validQualities = ['enchanted', 'masterwork', 'ultimate', 'mythic'];
			console.log("Used " + this.name + " on " + target.name);
			if(!validQualities.includes(target.quality)) {
				return false;
			}

			target.clearAffixes();
			target.createMissingAffixes();

			return true;
		},
		consumeOnUse: true,
		
		spriteX: 0,
		spriteY: 15,
	},
	'FableScroll': {
		name: 'Fable Scroll',
		description: "Randomize the affixes on an item with rarity: godly",

		itemType: ['item', 'scroll'],
		quality: 'ultimate',

		usable: true,
		useTargets: ['equipment'],
		useAction: function(target) {
			var validQualities = ['godly'];
			console.log("Used " + this.name + " on " + target.name);
			if(!validQualities.includes(target.quality)) {
				return false;
			}

			target.clearAffixes();
			target.createMissingAffixes();

			return true;
		},
		consumeOnUse: true,
		
		spriteX: 0,
		spriteY: 15,
	},
	'EmpoweringOrb': {
		name: 'Empowering Orb',
		description: "Attempt to empower the item, increasing the quality level by one.",

		itemType: ['item', 'scroll'],
		quality: 'ordinary',

		usable: true,
		useTargets: ['equipment'],
		useAction: function(target) {
			var probabilities = {
				'shoddy': 0.95,
				'ordinary': 0.50,
				'uncommon': 0.25,
				'rare': 0.08,
				'enchanted': 0.025,
				'masterwork': 0.008,
				'ultimate': 0.002,
				'mythic': 0.0004,
				'godly': 0.000000
			};

			if(Math.randDec() <= probabilities[target.quality]) {
				target.changeQualityByLevel(1);
				return true;
			} else {
				return true;
			}
		},
		consumeOnUse: true,
		
		spriteX: 1,
		spriteY: 15,
	},
}





_.extend(BaseItems, CurrencyItems);

module.exports = BaseItems;