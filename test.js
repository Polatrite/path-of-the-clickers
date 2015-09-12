var Player = require(appRoot + '/shared/Player.js');
var Minion = require(appRoot + '/shared/Minion.js');
var Item = require(appRoot + '/shared/Item.js');
var Affix = require(appRoot + '/shared/Affix.js');
var AffixType = require(appRoot + '/shared/AffixType.js');

var player = new Player({
	name: 'Test Dummy'
});

var minion = new Minion({
	name: 'Big Pig',
});

var stats = minion.resetCombatStats();

var item = new Item({
	baseItem: 'WoodenSword',
	name: 'Rending Shortsword',
	level: 40
});

//item.stats.attack = 11;

/*var affixType = new AffixType({
	name: 'Attack Damage',
	type: 'primary',
	statRanges: {
		attack: {
			min: 13,
			max: 18
		}
	},
	levelMin: 0,
	levelMax: 10
});

var affix = affixType.createAffix();

affix.apply(item);
item.equipOn(minion);
affix.unapply();
affix.apply(item);
item.unequip();*/

item.move(player.inventory, 4);
item.move(player.inventory);
item.move(player.inventory, 10);

var item2 = new Item();
item2.move(player.inventory, 6);
item2.move(player.inventory, 12);

console.log(item);
item.applyQuality('uncommon', true);
console.log(item.tooltip);
item.clearAffixes();
item.createMissingAffixes();
item.clearAffixes();
item.createMissingAffixes();
item.clearAffixes();
item.createMissingAffixes();
item.clearAffixes();
console.log(item.tooltip);
console.log(item.stats);

//console.log(player.inventory.items);

console.log("Tests finished");
