var app = angular.module('app', []);

app.controller("MainCtrl", ['$scope', '$interval', '$timeout', function(scope, $interval, $timeout) {
	angular.extend(scope, {
		player: null,
		inventory: [],
		monsters: [],
		squads: []
	});
	
	angular.extend(scope, {
		start: function() {
			scope.player = preloadedPlayer;
			
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


function createInventory() {
    var slots = _.range(0, 24);
    var inventory = [];
    _.each(slots, function(slot) {
        inventory[slot] = null;
    });
    return inventory;
}

var preloadedInventory = createInventory();
preloadedInventory[0] = new Item({
    cssClass: 'axe1',
    itemType: 'item weapon axe',
    name: 'Flaming Battle Axe',
    description: 'Axe of the battles.',
    tooltip: "DURRR! AXE!"
});

preloadedInventory[4] = new Item({
    cssClass: 'carrot',
    itemType: 'item food',
    name: 'Carrot',
    description: '',
    tooltip: "Warning: not a dildo"
});

preloadedInventory[6] = new Item({
    cssClass: 'carrot',
    itemType: 'item food',
    name: 'Carrot',
    description: '',
    tooltip: "Warning: not a dildo"
});

preloadedInventory[13] = new Item({
    cssClass: 'axe1',
    itemType: 'item weapon axe',
    name: 'Flaming Battle Axe',
    description: 'Axe of the battles.',
    tooltip: "DURRR! AXE!"
});

var preloadedPlayer = {
    inventory: preloadedInventory,
    minions: [{
        name: "Angel Warrior",
        description: "She's an angel warrior, obviously.",
        image: '../../img/monsters/angel-warrior-2.png',
        badass: false,
        /*items: {
            weapon: {
                cssClass: 'inventory-item sword1',
                itemType: 'item weapon sword',
                name: 'Frost Sword',
                description: '(NULL)',
                tooltip: 'Woah!'
            }
        }*/
        items: [
            {
                index: 1,
                itemType: 'weapon',
                placeholderCssClass: 'inventory-placeholder weapon',
                item: null
            },
            {
                index: 2,
                itemType: 'amulet',
                placeholderCssClass: 'inventory-placeholder amulet',
                item: null
            },
            {
                index: 3,
                itemType: 'trinket',
                placeholderCssClass: 'inventory-placeholder trinket',
                item: null
            },
        ]
    }, {
        name: "Baby Chimera",
        description: "It's all fun and games until somebody is on fire.",
        image: '../../img/monsters/chimera-1.png',
        badass: false,
        items: [
            {
                index: 1,
                itemType: 'weapon',
                placeholderCssClass: 'inventory-placeholder weapon',
                item: null
            },
            {
                index: 2,
                itemType: 'amulet',
                placeholderCssClass: 'inventory-placeholder amulet',
                item: null
            }
        ]
    }, {
        name: "Wise Buddy",
        description: "A frog.",
        image: '../../img/monsters/frog-1.png',
        badass: true,
        items: [
            {
                index: 1,
                itemType: 'weapon',
                placeholderCssClass: 'inventory-placeholder weapon',
                item: null
            },
            {
                index: 2,
                itemType: 'amulet',
                placeholderCssClass: 'inventory-placeholder amulet',
                item: null
            }
        ]
    }, ],
    workers: 3859,
    workersUsed: 2811,
    money: 343417831.38
};