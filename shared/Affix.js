var _ = require('underscore');

var Affix = function(conf) {
	this.name = "Debugging";
	this.type = "primary";
	this.stats = {};

	_.extend(this, conf);
};

Affix.prototype.apply = function(minion) {
	if(minion.affixes.includes(this)){
		console.error(minion.name + " already affected by " + this.name);
		return;
	}

	minion.affixes.push(this);

	_.each(this.stats, function(value, stat) {
		if(stat in minion) {
			minion[stat] += value;
		}
	});
}

Affix.prototype.remove = function(minion) {
	_.each(this.stats, function(value, stat) {
		if(stat in minion) {
			minion[stat] -= value;
		}
	});
}

module.exports = Affix;
