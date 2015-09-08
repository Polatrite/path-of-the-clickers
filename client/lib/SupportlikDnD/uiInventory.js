/**
 *
 * @param {Number} size
 * @param {String[]} whitelist
 * @param {String[]}blacklist
 */

module.exports = function UiInventory(inventoryModel, size, whitelist, blacklist, items, changedCallback) {
    'use strict';
    /**
     * self reference for inner use
     * @type {Item}
     */
    var that = this;
    /**
     * Items of the inventory. empty slots will be null
     * @type {Array}
     */
    this.items = items || [];
    this.inventoryModel = inventoryModel;
    
    /**
     * Callback that fires whenever the items have changed
     */
    this.changedCallback = changedCallback;
    /**
     * Size of the inventory
     * @type {Number}
     */
    this.size = size;

    for (var i = 0; i < size; i++) {
        this.items[i] = null;
    }
    /**
     * Tag whitelist.
     * @type {String[]}
     */
    this.whitelist = whitelist;
    /**
     * Tag blacklist.
     * @type {String[]}
     */
    this.blacklist = blacklist;


    /**
     * Checks if the item has a tag in the blacklist => false
     * Checks if the item has ALL the tags in the whitelist => true
     * If the whitelist is empty and the item has no tags of the blacklist => true
     *
     * @param {Item} item
     * @returns {boolean}
     */
    this.checkItemFilter = function (item) {

        for (var index = 0; index < that.blacklist.length; index++) {
            var blacklist_tag = that.blacklist[index];
            for (var item_index = 0; item_index < item.tags.length; item_index++) {
                var item_tag = item.tags[item_index];
                if (item_tag == blacklist_tag) return false;
            }
        }

        var needed_tag_size = that.whitelist.length;
        var tag_hits = 0;

        for (var index = 0; index < that.whitelist.length; index++) {
            var whitelist_tag = that.whitelist[index];
            for (var item_index = 0; item_index < item.tags.length; item_index++) {
                var item_tag = item.tags[item_index];
                if (item_tag == whitelist_tag) tag_hits++;
            }
        }

        return needed_tag_size == tag_hits;
    };
    /**
     * Checks if an Item is in this specific slot. If index is greater size false will be returned
     * @param index lookup index
     * @returns {boolean}
     */
    this.isItemInSlot = function (index) {
        if (index >= that.size) return false;
        return that.items[index] != null;
    };

    /**
     * Adds a tag to the whitelist. If the tag already exists it prints a msg to the info console and does not add the tag.
     * @param {String} new_tag
     */
    this.add_whitelist_tag = function (new_tag) {
        var exists = false;
        that.whitelist.forEach(function (existing_tag) {
            if (new_tag == existing_tag) {
                exists = true;
                console.info("The tag " + new_tag + " already exists in this whitelist: ", that, that.whitelist);
            }
        });

        if (!exists) that.whitelist.push(new_tag);
    };

    /**
     * Removes a tag from the whitelist. If the tag doesn't exists it prints a msg to the info console and does not remove the tag.
     * @param {String} r_tag
     */
    this.remove_whitelist_tag = function (r_tag) {
        var exists = false;
        var item_index = -1;
        for (var index = 0; index < that.whitelist.length; index++) {
            var tag = that.whitelist[index];
            if (tag == r_tag) {
                item_index = index;
                exists = true;
            }
        }

        if (exists) that.whitelist.splice(tag_index, 1);
        else {
            console.info("The tag " + r_tag + " doesn't exists in this whitelist: ", that, that.whitelist);
        }
    };
    /**
     * Adds a tag to the blacklist. If the tag already exists it prints a msg to the info console and does not add the tag.
     * @param {String} new_tag
     */
    this.add_blacklist_tag = function (new_tag) {
        var exists = false;
        that.blacklist.forEach(function (existing_tag) {
            if (new_tag == existing_tag) {
                exists = true;
                console.info("The tag " + new_tag + " already exists in this blacklist: ", that, that.blacklist);
            }
        });

        if (!exists) that.blacklist.push(new_tag);
    };
    /**
     * Removes a tag from the blacklist. If the tag doesn't exists it prints a msg to the info console and does not remove the tag.
     * @param {String} r_tag
     */
    this.remove_blacklist_tag = function (r_tag) {
        var exists = false;
        var item_index = -1;
        for (var index = 0; index < that.blacklist.length; index++) {
            var tag = that.blacklist[index];
            if (tag == r_tag) {
                item_index = index;
                exists = true;
            }
        }

        if (exists) that.blacklist.splice(tag_index, 1);
        else {
            console.info("The tag " + r_tag + " doesn't exists in this blacklist: ", that, that.blacklist);
        }
    };
    /**
     * returns the next empty slot if available
     * @returns {number} empty slot index or -1 if full
     */
    this.get_empty_slot = function () {
        for (var i = 0; i < that.size; i++) {
            if (that.items[i] == null) return i;
        }

        return -1;
    };

    /**
     * Adds an item to the Inventory. If the item is added true or an item is given back. A item only returns if the
     * given position in the inventory is already taken, so the item of this position is returned.
     * @param a_item Item which should be added to the inventory.
     * @param position Optional. The wanted position of the item in the inventory.
     * @returns {boolean|Item} False if not added. True if added. Item if added and the position was already taken. So the item of this position is returned.
     */
    this.addItem = function (a_item, position, suppressCallback) {

        if (typeof position == "undefined" && !(that.get_empty_slot() >= 0)) {
            console.info("Inventory is full!", that, a_item);
            return false;
        }

        if (typeof position != "undefined" && position > that.size) {
            console.error("Out of Inventory Bounds!", that, a_item, position);
            return false;
        }

        if (!that.checkItemFilter(a_item)) {
            console.info("Item is not valid!", that, a_item);
            return false;
        }

        var exists = false;
        that.items.forEach(function (existing_tag) {
            if (a_item == existing_tag) {
                exists = true;
                console.info("This item is already in this inventory: ", that, a_item);
            }
        });
        var ret = false;
        var from, to = null;
        var fromIndex = -1;
        var toIndex = -1;
        if (!exists) {
            if (typeof position == "undefined") {
console.log("pos undefined");
                to = that;
                toIndex = that.get_empty_slot()
                that.items[toIndex] = (a_item);
                ret = true;

            } else {
                if (that.items[position] == null) {
console.log("pos null");
                    that.items[position] = a_item;
                    to = that;
                    toIndex = position;
                    ret = true;
                } else {
console.log("other item");
                    var tmp_item = that.items[position];
                    from = a_item.container;
                    fromIndex = from.items.indexOf(a_item);
                    if (from.checkItemFilter(tmp_item)) {
                        to = that;
                        toIndex = position;
                        to.items[toIndex] = a_item;
                        from.items[fromIndex] = tmp_item;
                        tmp_item.container = from;
                        var thing = {
                            from: from,
                            fromIndex: fromIndex,
                            to: to,
                            toIndex: toIndex
                        };
console.log("not exist deep dumb ", thing);
                        if(!suppressCallback)
                            that.changedCallback("moved", tmp_item, to, toIndex, from, fromIndex);
console.log("not exist deep " + fromIndex + "," + toIndex);
                        ret = true;
                    } else {
                        return false;
                    }

                }
            }
            if (a_item.container != null) {
                from = a_item.container;
console.log("not null container " + fromIndex + "," + toIndex);
                if(fromIndex == -1) {
                    fromIndex = from.items.indexOf(a_item);
console.log("not null container " + fromIndex + "," + toIndex);
                    from.items[fromIndex] = null;
                }
console.log("not null container " + fromIndex + "," + toIndex);
                //a_item.container.changedCallback("moved", a_item, from, fromIndex, to, toIndex);
            }
            a_item.container = that;

        } else {
console.log("pos initial");
            from = that;
            fromIndex = that.items.indexOf(a_item);
            to = that;
            
            if (typeof position == "undefined") {
console.log("pos undefined");
                toIndex = that.get_empty_slot()
                that.items[toIndex] = (a_item);
                ret = true;
            } else {
                if (that.items[position] == null) {
console.log("pos null");
                    that.items[fromIndex] = null;
                    that.items[position] = a_item;
                    toIndex = position;
                    ret = true;
                } else {
                    var tmp_item = that.items[position];
                    that.items[position] = a_item;
                    that.items[fromIndex] = tmp_item;
console.log("exist deep");
                    if(!suppressCallback)
                        that.changedCallback("moved", tmp_item, that, position, that, fromIndex);
                    toIndex = position;
                    ret = true;
                }
            }
        }

console.log("end");
        if(!suppressCallback)
            that.changedCallback("moved", a_item, from, fromIndex, to, toIndex);
        return ret;
    };
    /**
     * Removes a item of the inventory. If the item does not exists a info msg is printed on the console.
     * @param r_item
     */
    this.remove_item = function (r_item) {
        console.error("Remove item called");
        var exists = false;
        var item_index = -1;
        for (var index = 0; index < that.items.length; index++) {
            var item = that.items[index];
            if (item == r_item) {
                item_index = index;
                exists = true;
            }
        }

        if (exists) {
            that.tags.splice(item_index, 1);
        }
        else {
            console.info("This item doesn't exists in this inventory: ", that, r_item);
        }
    }
    
    this.clear = function() {
        for (var index = 0; index < that.items.length; index++) {
            delete that.items[index];
        }
    }
}
