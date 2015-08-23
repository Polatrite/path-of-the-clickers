/**
 *
 * @param {Number} size
 * @param {String[]} whitelist
 * @param {String[]}blacklist
 */

module.exports = function UiInventory(size, whitelist, blacklist) {
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
    this.items = [];
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
    this.add_item = function (a_item, position) {

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
        if (!exists) {
            if (typeof position == "undefined") {
                that.items[that.get_empty_slot()] = (a_item);
                ret = true;

            } else {
                if (that.items[position] == null) {
                    that.items[position] = a_item;
                    ret = true;
                } else {
                    var tmp_item = that.items[position];
                    var old_container = a_item.container;
                    var old_index = old_container.items.indexOf(a_item);
                    if (old_container.checkItemFilter(tmp_item)) {
                        that.items[position] = a_item;
                        old_container.items[old_index] = tmp_item;
                        tmp_item.container = old_container;
                        ret = true;
                    } else {
                        return false;
                    }

                }
            }
            if (a_item.container != null) {
                var old_index = a_item.container.items.indexOf(a_item);
                a_item.container.items[old_index] = null;
            }
            a_item.container = that;

        } else {
            if (typeof position == "undefined") {
                that.items[that.get_empty_slot()] = (a_item);
                ret = true;
            } else {
                if (that.items[position] == null) {
                    var old_index = that.items.indexOf(a_item);
                    that.items[old_index] = null;
                    that.items[position] = a_item;
                    ret = true;
                } else {
                    var tmp_item = that.items[position];
                    var old_index = that.items.indexOf(a_item);
                    that.items[position] = a_item;
                    that.items[old_index] = tmp_item;
                    ret = true;
                }
            }
        }
        return ret;
    };
    /**
     * Removes a item of the inventory. If the item does not exists a info msg is printed on the console.
     * @param r_item
     */
    this.remove_item = function (r_item) {
        var exists = false;
        var item_index = -1;
        for (var index = 0; index < that.items.length; index++) {
            var item = that.items[index];
            if (item == r_tag) {
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
}
