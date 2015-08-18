var _ = require('underscore');
var Item = require('./Item.js');
var Player = require('./Player.js');
var AffixType = require('./AffixType.js');
var StatRange = require('./StatRange.js');

var data = {};

data.primaryAffixes = {
	attack: [
		new AffixType({
			name: "Damage",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 3,
					max: 8
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
		new AffixType({
			name: "Damage+",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 8,
					max: 14
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
		new AffixType({
			name: "Damage++",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 15,
					max: 23
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
		new AffixType({
			name: "Damage+++",
			type: "primary",
			statRanges: [
				new StatRange({
					stat: "attack",
					min: 25,
					max: 35
				})
			],
			levelMin: 1,
			levelMax: 8
		}),
	]
}

function createInventory() {
    var slots = _.range(0, 24);
    var inventory = [];
    _.each(slots, function(slot) {
        inventory[slot] = null;
    });
    return inventory;
}

var preloadedInventory = createInventory();
preloadedInventory[0] = new Item({
    cssClass: 'axe1',
    itemType: 'item weapon axe',
    name: 'Flaming Battle Axe',
    description: 'Axe of the battles.',
    tooltip: "DURRR! AXE!"
});

preloadedInventory[4] = new Item({
    cssClass: 'carrot',
    itemType: 'item food',
    name: 'Carrot',
    description: '',
    tooltip: "A wild carrot"
});

preloadedInventory[6] = new Item({
    cssClass: 'carrot',
    itemType: 'item food',
    name: 'Carrot',
    description: '',
    tooltip: "A wild carrot"
});

preloadedInventory[13] = new Item({
    cssClass: 'axe1',
    itemType: 'item weapon axe',
    name: 'Flaming Battle Axe',
    description: 'Axe of the battles.',
    tooltip: "DURRR! AXE!"
});

data.preloadedPlayer = new Player({
    inventory: preloadedInventory,
    minions: [{
        name: "Angel Warrior",
        description: "She's an angel warrior, obviously.",
        image: '../../img/monsters/angel-warrior-2.png',
        badass: false,
        /*items: {
            weapon: {
                cssClass: 'inventory-item sword1',
                itemType: 'item weapon sword',
                name: 'Frost Sword',
                description: '(NULL)',
                tooltip: 'Woah!'
            }
        }*/
        items: [
            {
                index: 1,
                itemType: 'weapon',
                placeholderCssClass: 'inventory-placeholder weapon',
                item: null
            },
            {
                index: 2,
                itemType: 'amulet',
                placeholderCssClass: 'inventory-placeholder amulet',
                item: null
            },
            {
                index: 3,
                itemType: 'trinket',
                placeholderCssClass: 'inventory-placeholder trinket',
                item: null
            },
        ]
    }, {
        name: "Baby Chimera",
        description: "It's all fun and games until somebody is on fire.",
        image: '../../img/monsters/chimera-1.png',
        badass: false,
        items: [
            {
                index: 1,
                itemType: 'weapon',
                placeholderCssClass: 'inventory-placeholder weapon',
                item: null
            },
            {
                index: 2,
                itemType: 'amulet',
                placeholderCssClass: 'inventory-placeholder amulet',
                item: null
            }
        ]
    }, {
        name: "Wise Buddy",
        description: "A frog.",
        image: '../../img/monsters/frog-1.png',
        badass: true,
        items: [
            {
                index: 1,
                itemType: 'weapon',
                placeholderCssClass: 'inventory-placeholder weapon',
                item: null
            },
            {
                index: 2,
                itemType: 'amulet',
                placeholderCssClass: 'inventory-placeholder amulet',
                item: null
            }
        ]
    }, ],
    workers: 3859,
    workersUsed: 2811,
    money: 343417831.38
});

module.exports = data;