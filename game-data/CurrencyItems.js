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
		
		spriteX: 0,
		spriteY: 15,
	},
	'ScrollEnchantment': {
		name: 'Scroll of Enchantment',
		description: "Randomize the affixes on an item with rarity: enchanted, masterwork, ultimate",

		itemType: ['item', 'scroll'],
		quality: 'enchanted',

		usable: true,
		useTargets: ['equipment'],
		useAction: function(target) {
			console.log("Used " + this.name + " on " + target.name);
		},
		
		spriteX: 0,
		spriteY: 15,
	},
}

_.extend(BaseItems, CurrencyItems);

module.exports = BaseItems;