window.appRoot = '.';
window._ = require('underscore');

var angular = require('angular');
var uiBootstrap = require('angular-ui-bootstrap');
var _ = require('underscore');

var UiInventory = require('../client/lib/SupportlikDnD/uiInventory.js');
var UiItem = require('../client/lib/SupportlikDnD/uiItem.js');
var dragInventory = require('../client/lib/SupportlikDnD/dragInventory.js');

var url = window.location.protocol + "//" + window.location.host + ":8080";
console.log("Socket.io URL set to " + url);
var socket = null;




var app = angular.module('app', [dragInventory.name, uiBootstrap]);

app.factory('socket', function($rootScope) {
	var socket = require('socket.io-client')(url);
	console.log("Initializing socket.IO client");
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		},
		socket: function() {
			return socket;
		}
	};
});

app.controller("LoginCtrl", ['$scope', 'socket', '$http', 'Player', function(scope, socket, $http, Player) {
	angular.extend(scope, {
		username: '',
		password: '',
		tab: 'login',
	});
	
	angular.extend(scope, {
		login: function() {
			$http.post('/player/login', {
				username: scope.username,
				password: scope.password
			}).then(function(res) {
				console.log(res);
				Player.instance = res.data;
				console.log("Player service set to ", Player.instance);
				scope.$close(res.data);
			}, function(err) {
				console.log(err);
			});
		},
		signup: function() {
			console.log('Signup Player:', Player);
			$http.post('/player/' + Player.instance.uid + '/signup', {
				uid: Player.instance.uid,
				username: scope.username,
				name: scope.username,
				password: scope.password,
				email: 'gamedev@mailinator.com',
				captcha: 'unimplemented'
			}).then(function(res) {
				console.log(res);
			}, function(err) {
				console.log(err);
			});
		}
	});
}]);

app.controller("MainCtrl", ['$scope', 'socket', '$http', '$modal', 'Player', function(scope, socket, $http, $modal, Player) {
	angular.extend(scope, {
		player: null,
		loggedIn: false,
        debugObjects: []
	});
	
	angular.extend(scope, {
		openLoginModal: function() {
			var loginModal = $modal.open({
				templateUrl: 'login.html',
				controller: 'LoginCtrl',
				openedClass: 'modal-open',
				backdrop: 'static'
				//keyboard: false
			}).result.then(function(data) {
				console.log("Modal data return", data);
				scope.loadPlayer(data);
				scope.loggedIn = true;
				loginModal.close();
			});
			
		},
		
		loadPlayer: function(player) {
			scope.loadInventory(player);
			scope.player = player;
		},
		
		loadInventory: function(player) {
			_.each(player.inventory.items, function(item) {
				if(!item) return;
				var uiItem = new UiItem(item.name, item);
				console.log("Wrapped UiItem", uiItem);
				scope.inventory.addItem(uiItem, item.locationIndex);
			});
		},
		
		updateInventory: function(player) {
			var inventoryPost = [];
			for(var i = 0; i < scope.inventory.items.length; i++) {
				var uiItem = scope.inventory.items[i];
				if(uiItem) {
					inventoryPost.push({
						uid: uiItem.serverItem.uid,
						locationIndex: i
					});
				}
			}
			$http.post('/player/inventory/update', {
				uid: player.uid,
				inventory: inventoryPost
			}).then(function(res) {
				
			}, function(err) {
				
			});
		},
		
		start: function() {
			$http.post('/player/create')
				.then(function(res) {
					console.log('Create call:', res);
					Player.instance = res.data;
					scope.loadPlayer(res.data);
					scope.$watch('inventory.items', function() {
						console.log("Inventory changed", scope.inventory);
					});
					console.log("Scope player set to ", scope.player);
				}, function(err) {
					console.log(err);
				});
			
			/*scope.player = data.preloadedPlayer;
			scope.debugObjects = [scope.player, scope.inventory, scope.minions];
			console.log("Player loaded", scope.player);
			Player = scope.player;*/
		},
		
		clickDebug1: function() {
			$http.get('/player/100000')
				.then(function(res) {
					console.log(res);
				}, function(err) {
					
				});
		},
		clickDebug2: function() {
			console.log(scope.inventory);
		},
		clickDebug3: function() {
			
		}
	});
	
    scope.inventory = new UiInventory(32, [], [], [], function(action, item, from, fromIndex, to, toIndex) {
    	console.log("Inventory has changed", arguments);
    	if(scope.player)
    		scope.updateInventory(scope.player);
    });
    
    scope.stash = new UiInventory(40, [], [], [], function(action, item, from, fromIndex, to, toIndex) {
    	console.log("Stash has changed", arguments);
    	if(scope.player)
    		scope.updateInventory(scope.player);
    });

    /*scope.inv2 = new UiInventory(50, [], ["enchanted"]);
    scope.back_pack = new UiInventory(9, [], []);
    scope.weapon_not_enchanted = new UiInventory(4, ['weapon'], ['enchanted']);
    scope.weapon_enchanted = new UiInventory(4, ['weapon', 'enchanted'], ['axe']);*/

    /*scope.inventory.addItem(new UiItem("Sword", ["item", "weapon", "sword"], 0, -170, sprite));
    scope.inventory.addItem(new UiItem("Sword", ["item", "weapon", "sword"], 0, -170, sprite));
    scope.inventory.addItem(new UiItem("Fire Sword", ["item", "weapon", "sword", "enchanted"], -34, -952, sprite));
    scope.inventory.addItem(new UiItem("Axe", ["item", "weapon", "axe"], -170, -340, sprite));
    scope.inventory.addItem(new UiItem("Fire Axe", ["item", "weapon", "axe", "enchanted"], -306, -340, sprite));*/

    scope.r1 = 5;
    scope.c1 = 8;

	console.log('Calling start');
	scope.start();
}]);

app.controller("ChatCtrl", ['$scope', 'socket', function(scope, socket) {
    scope.messages = [];
    for(var i = 0; i <= 25; i++) {
    	scope.messages.push(Math.random());
    }
    scope.sendMessage = function() {
    	var message = scope.messageText;
        socket.emit('new message', message);
        scope.messageText = "";
        console.log("Emitting message: ", message);
    };
    
    console.log("socket,", socket);

    socket.on('new message', function(data) {
    	console.log('Message received: ', data);
        scope.messages.push(formatMessage(data));
    });
    
    function formatMessage(data) {
    	return "[00:00] " + data.username + ": " + data.message;
    }
    
}]);

app.service('Player', function() {
	var player;
	return {
		instance: player
	}
});

app.directive('slot', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.on('click', function() {
				if (!window.getSelection().toString()) {
					// Required for mobile Safari
					this.setSelectionRange(0, this.value.length)
				}
			});
		}
	};
});

app.directive('selectOnClick', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.on('click', function() {
				if (!window.getSelection().toString()) {
					// Required for mobile Safari
					this.setSelectionRange(0, this.value.length)
				}
			});
		}
	};
});

app.directive('scrollToLast', ['$location', '$anchorScroll', function($location, $anchorScroll) {
	function linkFn(scope, element, attrs) {
		$location.hash(attrs.scrollToLast);
		$anchorScroll();
	}

	return {
		restrict: 'AE',
		scope: {

		},
		link: linkFn
	};

}]);
