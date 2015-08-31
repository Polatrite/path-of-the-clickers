var appRoot = require('app-root-path');

function playerSaveLoad() {
	var Player = require(appRoot + '/shared/Player.js');
	
	var player = new Player({ uid: 100000, name: 'Polatrite' });
	player.save();
	
	player = null;
	player = new Player({ loadById: 100000 });
	
	if(player.uid == 100000 && player.name == 'Polatrite')
		return true;
}
