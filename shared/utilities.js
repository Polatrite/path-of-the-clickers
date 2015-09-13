if (!Object.prototype.toDebugString) {
	Object.prototype.toDebugString = function() {
		if(this.entityType && this.name) 
			return this.entityType + '[' + this.name + ']';
		else
			return this.toString();
	}
}

if (!Array.prototype.includes) {
	Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
		'use strict';
		var O = Object(this);
		var len = parseInt(O.length) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1]) || 0;
		var k;
		if (n >= 0) {
			k = n;
		}
		else {
			k = len + n;
			if (k < 0) {
				k = 0;
			}
		}
		var currentElement;
		while (k < len) {
			currentElement = O[k];
			if (searchElement === currentElement ||
				(searchElement !== searchElement && currentElement !== currentElement)) {
				return true;
			}
			k++;
		}
		return false;
	};
}	
if (!Array.prototype.includesUid) {
	Array.prototype.includesUid = function(uid) {
		'use strict';
		var arr = Object(this);
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] && arr[i].uid === uid) {
				return i;
			}
		}
		
		return -1;
	};
}
if (!Array.prototype.removeUid) {
	Array.prototype.removeUid = function(uid, replace) {
		'use strict';
		if(replace === undefined) replace = null;
		var arr = Object(this);
		var found = false;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] && arr[i].uid === uid) {
				arr[i] = replace;
				found = true;
			}
		}
		
		return found;
	};

}

if (!Array.prototype.remove) {
	Array.prototype.remove = function(element) {
		var index = this.indexOf(element);
		this.splice(index, 1);
		return this;
	}
}

if (!Array.prototype.pick) {
	Array.prototype.pick = function() {
		var O = Object(this);
		return O[Math.floor(Math.random()*this.length)];
	}
}

if (!Math.randInt) {
	Math.randInt = function(min, max) {
		if(!min) min = 0;
		if(!max) max = 100;
		return Math.floor(Math.random() * (max - min) + min);
	}
}

if (!Math.randDec) {
	Math.randDec = function(min, max) {
		if(!min) min = 0;
		if(!max) max = 1;
		return Math.random() * (max - min) + min;
	}
}

function curr(value) {
	return Number(value.toFixed(2));
}

function round(value) {
	return Math.round(value);
}

function generateRandomName() {
	var startWords = ["Legend", "Ace", "Action", "Adventure", "After", "Air", "Airbourne", "Alien",
	"Alone", "Amazing", "Archon", "Armor", "Age", "Aqua",
	"Balance", "Bad", "Battle", "Bandit",
	"Barbarian", "Below", "Big", "Bio", "Black", "Blind", "Blood", "Blue", "Bomb", "Bomber", "Border",
	"Brain", "Bubble", "Burn",
	"Campaign", "Captain", "Car", "Castle", "Catacomb", "Chaos", "Chrono",
	"Civil", "Cloud", "Cold", "Command", "Cool", "Creature", "Cyber", "Cockananny",
	"Demon", "Daemon", "Dangerous", "Dark", "Defender", "Despair", "Die", "Death", "Dinosaur", "Donkey",
	"Doom", "Down", "Dracula", "Dragon", "Dream", "Drug", "Duke", "Dungeon", "Doofy", "Derpy",
	"Echo", "Earth", "Eagle", "Elder", "Emergency", "Empire", "Encounter", "Executive", "Eye", 
	"Falcon", "Fade", "Face", "Fantasy", "Final", "Fast", "Field", "Fire", "Fleet", "Flying", "Forgotten",
	"Groveling", "Grappling", "Gear",
	"Lemming", "Legend", 
	"Mooing",
	"No no no",
	"Polka", "Party", "Punk", "Pickle", "Paragon",
	"Rotund",
	"Squeamish",
	"Turkey", "Turbulent", "Turbo", "Tricky"];
	var middleWords = ["of the", "no", "and", "of", "vs.", "to"];
	var endWords = ["Thunder", "Ball", "Puzzles", "Legions", "Viper", "Tentacle", "Death", "Descent", "Dungeon", "Dark", "Sun", "Moon", "Star", "Alien",
	"Predator", "Tomorrow", "Today", "Vengeance", "Wake", "Rain", "Speed", "Blood", "Guts",
	"Quest", "League", "Dragon", "Blade", "Sword", "Nodachi", "Simulator", "Fantasy", "Finale",
	"Duck", "Hobbit", "Dwarf", "Emu", "Toad", "Dunce", "Whack", "Boogey", "Shuffle"];

	var middleWord = "";
	if(randInt(1,5) == 3) {
		middleWord = middleWords.pick();
	}
	var name = startWords.pick() + " " + middleWord + (middleWord ? " " : "") + endWords.pick();
	return name;
}
