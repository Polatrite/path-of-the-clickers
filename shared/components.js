var angular = require('angular');
var _ = require('underscore');

var Player = require('./Player.js');
var Item = require('./Item.js');
var Minion = require('./Minion.js');
var Affix = require('./Affix.js');
var AffixType = require('./AffixType.js');
var StatRange = require('./StatRange.js');
var data = require('./data.js');

var app = angular.module('app', []);

app.controller("MainCtrl", ['$scope', '$interval', '$timeout', function(scope, $interval, $timeout) {
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


