var AffixGenerator = function(conf) {
	this.name = "Debugging";
	this.type = "primary";

	this.stats = [];
	
	this.levelMin = 0;
	this.levelMax = 100;
	this.levelGrowth = 0;
	
	this.quantity = 0;
}

Affix.prototype.generate = function() {
	var affixes = [];
	var affix;

	for(var i = 0; i <= quantity; i++) {
		affix = new AffixType({
			name: this.name,
			type: this.type,

		})
	}
}

(function() {
	var damageAffix = new AffixGenerator({
		name: "Damage",
		type: "primary",
		stats: [
			new StatRange({
				stat: "attack",
				min: 3,
				max: 8,
				spreadMinMax: function() {
					var spread = {
						min: 0
					}
				}
			})
		]
	});
})();