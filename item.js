var uidGenerator = {
	index: 1000000,
	generate: function(prefix) {
		this.index++;
		return prefix + this.index;
	}
};

function Item(cfg) {
	this.uid = uidGenerator.generate('item');
	this.cssClass = '';
	this.itemType = 'item';

	this.name = '';
	this.description = '';
	this.tooltip = '';
	
	_.extend(this, cfg);
}

Item.prototype.move = function(source, destination) {
	var sourceElem = $('#item' + this.uid);
	var destinationElem = $('#item' + this.uid); //TODO
}