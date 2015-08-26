var _ = require('underscore');
var Minion = require('./Minion.js');
var Item = require('./Item.js');
var Player = require('./Player.js');
var AffixType = require('./AffixType.js');
var StatRange = require('./StatRange.js');

var UiInventory = require('../client/lib/SupportlikDnD/uiInventory.js');

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
    minions: [
        new Minion({
            name: "Angel Warrior",
            description: "She's an angel warrior, obviously.",
            image: './img/minions/angel-warrior-2.png',
            equipment: {
    			weapon: new UiInventory(1, ['weapon'], []),
    			trinket: new UiInventory(1, ['trinket'], []),
    			amulet: new UiInventory(1, ['amulet'], [])
            }
        }),
        new Minion({
            name: "Baby Chimera",
            description: "It's all fun and games until somebody is on fire.",
            image: './img/minions/chimera-1.png',
            equipment: {
    			weapon: new UiInventory(1, ['weapon'], []),
    			trinket: new UiInventory(1, ['trinket'], []),
    			amulet: new UiInventory(1, ['amulet'], [])
            }
        }),
        new Minion({
            name: "Wise Buddy",
            description: "A frog.",
            image: './img/minions/frog-1.png',
            equipment: {
    			weapon: new UiInventory(1, ['weapon'], []),
    			trinket: new UiInventory(1, ['trinket'], []),
    			amulet: new UiInventory(1, ['amulet'], [])
            }
        })
    ],
    workers: 3859,
    workersUsed: 2811,
    money: 343417831.38
});

module.exports = data;