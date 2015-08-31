var app = angular.module("main_app", ['dragInventory']);
app.controller("main_controller", function ($scope) {
    $scope.name = "main";

    $scope.inv = new UiInventory(50, [], []);
    $scope.inv2 = new UiInventory(50, [], ["enchanted"]);
    $scope.back_pack = new UiInventory(9, [], []);
    $scope.chest = new UiInventory(10, [], []);
    $scope.weapon_not_enchanted = new UiInventory(4, ['weapon'], ['enchanted']);
    $scope.weapon_enchanted = new UiInventory(4, ['weapon', 'enchanted'], ['axe']);
    var sprite = "https://i.imgur.com/ngGK5MF.png";

    $scope.inv.add_item(new UiItem("Sword", ["item", "weapon", "sword"], 0, -170, sprite));
    $scope.inv.add_item(new UiItem("Sword", ["item", "weapon", "sword"], 0, -170, sprite));
    $scope.inv.add_item(new UiItem("Fire Sword", ["item", "weapon", "sword", "enchanted"], -34, -952, sprite));
    $scope.inv.add_item(new UiItem("Axe", ["item", "weapon", "axe"], -170, -340, sprite));
    $scope.inv.add_item(new UiItem("Fire Axe", ["item", "weapon", "axe", "enchanted"], -306, -340, sprite));

    $scope.r1 = 5;
    $scope.c1 = 5;
});


