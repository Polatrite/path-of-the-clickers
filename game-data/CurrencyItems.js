var BaseItems = require(appRoot + '/game-data/BaseItems.js');

var CurrencyItems = {
	'BreakingScroll': {
		name: 'Breaking Scroll',

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

		itemType: ['item', 'scroll'],
		quality: 'ordinary',

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