var _ = require('underscore');

var Affix = function(conf) {
	this.name = "Debugging";
	this.type = "primary";
	this.stats = {};

	_.extend(this, conf);
};

Affix.prototype.apply = function(monster) {
	if(monster.affixes.includes(this)){
		console.error(monster.name + " already affected by " + this.name);
		return;
	}

	monster.affixes.push(this);

	_.each(this.stats, function(value, stat) {
		if(stat in monster) {
			monster[stat] += value;
		}
	});
}

Affix.prototype.remove = function(monster) {
	_.each(this.stats, function(value, stat) {
		if(stat in monster) {
			monster[stat] -= value;
		}
	});
}

module.exports = Affix;
