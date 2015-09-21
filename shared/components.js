window.appRoot = '.';
window.Util = require('../shared/utilities.js');
window._ = require('underscore');
window.strf = require('../shared/strf.js');

var angular = require('angular');
var ngSanitize = require('angular-sanitize');
var uiBootstrap = require('angular-ui-bootstrap');
var _ = require('underscore');

var UiInventory = require('../client/lib/SupportlikDnD/uiInventory.js');
var UiItem = require('../client/lib/SupportlikDnD/uiItem.js');
var dragInventory = require('../client/lib/SupportlikDnD/dragInventory.js');

var url = window.location.protocol + "//" + window.location.host + ":8080";
console.log("Socket.io URL set to " + url);
var socket = null;




var app = angular.module('app', [dragInventory.name, uiBootstrap, ngSanitize]);

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
		error: null,
		loading: false,
		username: '',
		password: '',
		tab: 'login',
	});
	
	angular.extend(scope, {
		login: function() {
			scope.error = null;
			scope.loading = true;
			$http.post('/player/login', {
				username: scope.username,
				password: scope.password
			}).then(function(res) {
				scope.loading = false;
				console.log(res);
				Player.instance = res.data;
				console.log("Player service set to ", Player.instance);
				scope.$close(res.data);
			}, function(err) {
				scope.loading = false;
				scope.error = err.data;
				console.log(err);
			});
		},
		signup: function() {
			scope.error = null;
			scope.loading = true;
			$http.post('/player/' + Player.instance.uid + '/signup', {
				uid: Player.instance.uid,
				username: scope.username,
				name: scope.username,
				password: scope.password,
				email: scope.email,
				captcha: 'unimplemented'
			}).then(function(res) {
				scope.loading = false;
				console.log(res);
				Player.instance = res.data;
				console.log("Player service set to ", Player.instance);
				scope.$close(res.data);
			}, function(err) {
				scope.loading = false;
				scope.error = err.data;
				console.log(err);
			});
		}
	});
}]);

app.controller("MainCtrl", ['$scope', 'socket', '$http', '$modal', 'Player', function(scope, socket, $http, $modal, Player) {
	angular.extend(scope, {
		player: null,
		inventory: new UiInventory(null, 40, [], [], [], scope.itemMovedEvent),
		loggedIn: false,
		debugObjects: [],
		output: []
	});

	angular.extend(scope, {
		logOutput: function(msg) {
			scope.output.push(msg + "<br>");
			if(scope.output.length > 10) {
				scope.output = scope.output.slice(1);
			}
		},

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
			});
			
		},
		
		loadPlayer: function(player) {
			scope.player = null;
			scope.loadInventory(player.inventory);
			scope.player = player;
			scope.logOutput("Loaded player " + player.username);
		},
		
		loadInventory: function(inventory) {
			console.log("Inventory before ", scope.inventory);
			scope.inventory.clear();
			scope.inventory.inventoryModel = inventory;
			_.each(inventory.items, function(item) {
				if(!item) return;
				var uiItem = new UiItem(item.name, item);
				uiItem.click = function(event) {
					console.log("Click!", item);
					if(scope.rightClickItem) {
						var originUid = scope.rightClickItem.serverItem.uid;
						scope.rightClickItem = null;
						console.log("Right-click is on the cursor, let's apply it!");
						$http.post('/item/use', {
							itemUid: originUid,
							targetUid: item.uid
						}).then(function(res) {
							//uiItem.updateItem(res.data.item);
							scope.logOutput("Used " + res.data.item.name + " on " + res.data.target.name);
							if(res.data.inventory) {
								scope.loadInventory(res.data.inventory);
							}
						}, function(err) {
							scope.logOutput(err.data);
							console.log("/item/use error", err);
						});
					}
				}
				uiItem.rightClick = function() {
					scope.rightClickItem = uiItem;
					console.log("Right-click!", item);
					scope.logOutput("Selected " + uiItem.name + " on the mouse cursor");
				}
				console.log("Wrapped UiItem", uiItem);
				scope.inventory.addItem(uiItem, item.locationIndex, true);
			});
			scope.inventory.changedCallback = scope.itemMovedEvent;
			console.log("Inventory after ", scope.inventory);
		},
		
		resyncPlayer: function() {
			$http.post('/player/resync', {
				playerUid: scope.player.uid
			}).then(function(res) {
				scope.loadPlayer(res.data);
			}, function(err) {
				
			});
		},
		
		moveItem: function(player, item, from, fromIndex, to, toIndex) {
			$http.post('/item/move', {
				playerUid: player,
				itemUid: item,
				fromUid: from,
				fromIndex: fromIndex,
				toUid: to,
				toIndex: toIndex
			}).then(function(res) {
				scope.logOutput("Moved " + item);
			}, function(err) {
				if(err.status === 660) {
					scope.resyncPlayer();
					return;
				}
				console.log("Item moved");
			});
		},
		
		start: function() {
			$http.post('/player/create')
				.then(function(res) {
					console.log('Create call:', res);
					scope.logOutput("Created a new account");
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
			
		},
		
		craft: function() {
			var baseItemTypes = ['GlassShard', 'WoodenSword', 'BasicHatchet', 'CrudeBow', 'ScrollAlteration', 'ScrollAlteration', 'EmpoweringOrb', 'EmpoweringOrb'];
			var baseItemType = baseItemTypes.pick();
			$http.post('/item/craft', {
				playerUid: scope.player.uid,
				baseItem: baseItemType,
				components: []
			}).then(function(res) {
				if(res.data.inventory) {
					scope.loadInventory(res.data.inventory);
					console.log("Reloaded inventory");
					scope.logOutput("Crafted " + res.data.item.name);
				}
			}, function(err) {
				console.error(err);
			});
		},
		
		itemMovedEvent: function(action, item, from, fromIndex, to, toIndex) {
	    	if(!scope.player)
	    		return;
	    	console.log("Inventory has changed", arguments);
	    	var fromUid = undefined;
	    	if(from && from.inventoryModel)
	    		fromUid = from.inventoryModel.uid;
	    	scope.moveItem(scope.player.uid, item.serverItem.uid, fromUid, fromIndex, to.inventoryModel.uid, toIndex);
	    }
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

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
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
