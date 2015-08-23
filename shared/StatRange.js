var _ = require('underscore');

var StatRange = function(conf) {
	this.stat = "";
	this.min = 0;
	this.max = 1;

	_.extend(this, conf);
}

StatRange.prototype.pick = function() {
	return randInt(this.min, this.max);
}

module.exports = StatRange;