var angular = require('angular');
var _ = require('underscore');

var Player = require('./Player.js');
var Item = require('./Item.js');
var Minion = require('./Minion.js');
var Affix = require('./Affix.js');
var AffixType = require('./AffixType.js');
var StatRange = require('./StatRange.js');
var data = require('./data.js');

var url = window.location.protocol + "//" + window.location.host + ":8080";
console.log("Socket.io URL set to " + url);
var socket = null;




var app = angular.module('app', []);

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

app.controller("MainCtrl", ['$scope', '$interval', '$timeout', 'socket', function(scope, $interval, $timeout, socket) {
	angular.extend(scope, {
		player: null,
		inventory: [],
		monsters: [],
		squads: [],
        debugObjects: []
	});
	
	angular.extend(scope, {
		start: function() {
			scope.player = data.preloadedPlayer;
			scope.debugObjects = [scope.player, scope.inventory, scope.monsters];
			console.log("Player loaded", scope.player);
		}
	});
	
	
	
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

app.directive('slot', function () {
		return {
				restrict: 'A',
				link: function (scope, element, attrs) {
						element.on('click', function () {
								if (!window.getSelection().toString()) {
										// Required for mobile Safari
										this.setSelectionRange(0, this.value.length)
								}
						});
				}
		};
});

app.directive('selectOnClick', function () {
		return {
				restrict: 'A',
				link: function (scope, element, attrs) {
						element.on('click', function () {
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


function initialize() {
    setTimeout(function() {
        refreshSortableInventoryList();
        
        var item = new Item();
        item.name = "Frost Sword";
        item.cssClass = "inventory-item sword1";
        item.itemType = "item weapon sword";
        
        player.minions[0].items[0].item = item;

        updateMinionItems();
    }, 200);
}

function updateMinionItems() {
    $("[apply-class]").addClass(function(index, currentClass) {
        $(this).addClass($(this).attr('apply-class'));
    });
    $('.inventory-item').tooltip({
        html: true
    });

    _.each(player.minions, function(minion) {
        _.each(minion.items, function(item) {
            //TODO
        });
    });
}


