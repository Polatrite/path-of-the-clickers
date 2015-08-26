var angular = require('angular');
var simplifiedDnD = require('./sf-drag.js');
var $ = require('jquery');

module.exports = angular.module("dragInventory", [simplifiedDnD.name]).
    directive("ngInventory", ['sfDragNDropService', function(sfDragNDropService) {
        return {
            restrict: "EA",
            templateUrl: "./lib/SupportlikDnD/inventory.html",
            replace: false,
            /**
             * @inventory {Inventory}
             * @inventory {Number}
             * @inventory {Number}
             */
            scope: {
                inventory: "=",
                rows: "=",
                columns: "="

            },
            link: function ($scope, element, attrs) {
                /**
                 * Session of the simplified.dragndrop Service of the https://github.com/SimpliField/angular-sf-dragndrop lib.
                 * Strong customized, so use the lib I provided
                 * @type {sfDragNDropService|*}
                 */
                $scope.dndSession = sfDragNDropService;
                /**
                 * Items of the inventory, will be used for the whole inventory
                 * @type {optionItems|a|*|DataTransferItemList|Array}
                 */
                $scope.items = $scope.inventory.items;
                /**
                 * Root Element of the Inventory.
                 * @type {*|jQuery|HTMLElement}
                 */
                var root = $(element);
                /**
                 * Checks if an Item is acutally Dragged.
                 * @returns {boolean}
                 */
                $scope.checkDrag = function () {
                    return !(sfDragNDropService.session.item == null || typeof sfDragNDropService.session.item == "undefined") && sfDragNDropService.session.pos.x != -1
                };

                /**
                 * Creates dummyLists for ng-repeat. Used for the colums and rows.
                 * @param num
                 * @returns {Array}
                 */
                $scope.getNumber = function (num) {
                    var arr = [];
                    for (var i = 0; i < num; i++) {
                        arr.push(i);
                    }
                    return arr;
                };

                /**
                 * Used for checking the target actually hovered while dragging an item.
                 *
                 * @param index
                 * @returns {boolean}
                 */
                $scope.checkTarget = function (index) {
                    return (sfDragNDropService.session.tar_index == index
                    && sfDragNDropService.session.inv == $scope.inventory);
                };
                /**
                 * Will be fired when dragging is started.
                 * @param origin_index is the index of the item.
                 */
                $scope.onDrag = function (origin_index) {
                    sfDragNDropService.session.origin_element = root.find('.item_index-' + origin_index);
                    sfDragNDropService.session.origin_position = sfDragNDropService.session.origin_element.offset();
                    sfDragNDropService.session.origin_index = origin_index;
                    sfDragNDropService.session.origin_item = $scope.inventory.items[origin_index];
                };
                /**
                 * Will be fired when an dragging stopped but the item is not dropped e. g. when not possible.
                 * @param $item dragged item
                 * @param $target always undefined or null // library bug
                 */
                $scope.onDragEnd = function ($item, $target) {
                    sfDragNDropService.session.item = null;
                    sfDragNDropService.session.target = null;
                    sfDragNDropService.session.inv = null;
                    sfDragNDropService.session.origin_index = null;
                    sfDragNDropService.session.tar_index = null;

                    sfDragNDropService.reset();
                };
                /**
                 * Will be fired when the user hovers over an inventory slot
                 * @param $item dragged item
                 * @param target_index always undefined or null // library bug
                 */
                $scope.onDragEnter = function ($item, target_index) {
                    sfDragNDropService.session.inv = $scope.inventory;
                    sfDragNDropService.session.tar_index = target_index;
                    //console.log("DRAG ENTER", sfDragNDropService.session.targetIndex);

                };
                /**
                 * will be fired when dropped on an inventory slot
                 * @param $item
                 * @param $target
                 * @param $returnValue
                 * @param index
                 * @returns {boolean|Item}
                 */
                $scope.onDrop = function ($item, $target, $returnValue, index) {
                    var res = $scope.inventory.addItem($item, index);
                    sfDragNDropService.session.item = null;
                    sfDragNDropService.session.target = null;
                    sfDragNDropService.session.inv = null;
                    sfDragNDropService.session.origin_index = null;
                    sfDragNDropService.session.tar_index = null;
                    sfDragNDropService.reset();
                    return res;
                };
                /**
                 * Gets the item index based on the actual column and row
                 * @param col column
                 * @param row row
                 * @returns item index
                 */
                $scope.getItemIndex = function (col, row) {
                    return (row * $scope.columns) + col
                };

            }
        };
    }]);