
/**
 * Prototype, extend for purpose: e. g. weapon dmg, health potion hp etc.
 * @param {String} name Name of the item.
 * @param {String[]} tags Tags of the item.
 * @param {Number} img_x_position img x position in the spritesheet
 * @param {Number} img_y_position img y position in the spritesheet
 * @param {String} spritesheet url of the spritesheet
 */
module.exports = function UiItem(name, serverItem) {
    'use strict';
    /**
     * self reference for inner use
     * @type {Item}
     */
    var that = this;
    
    this.serverItem = serverItem;
    
    /**
     * name of the item
     * @type {String}
     */
    this.name = serverItem.name;
    
    this.leftClick = function() {};
    this.rightClick = function() {};
    /**
     * Tags of the item.
     * @type {String[]}
     */
    this.tags = serverItem.itemType;
    
    this.tooltip = serverItem.tooltip;
    /**
     *
     * @type {Inventory}
     */
    this.container = null;

    /**
     * x position of the item in the spritesheet
     * @type {Number}
     */
    this.img_x_p = serverItem.spriteX * -34;
    /**
     * y position of the item in the spritesheet
     * @type {Number}
     */
    this.img_y_p = serverItem.spriteY * -34;
    /**
     * url to the spritesheet. can be a relative link
     * @type {String}
     */
    this.spritesheet = serverItem.spritesheet;

    this.updateItem = function(item) {
        that.serverItem = item;
        that.name = item.name;
        that.tooltip = item.tooltip;
        that.tags = item.tags;
    };

    /**
     * Adds a tag to the item.
     * @param new_tag tag which should be added.
     */
    this.add_tag = function(new_tag){
        var exists = false;
        that.tags.forEach(function(existing_tag){
            if(new_tag == existing_tag){
                exists = true;
                console.info("The tag "+ new_tag+ " already exists in this item: ", that.name, that);
            }
        });

        if(!exists) that.tags.push(new_tag);
    };
    /**
     * Removes a tag from the item
     * @param r_tag tag which should be removed
     */
    this.remove_tag = function(r_tag){
        var exists = false;
        var tag_index = -1;
        for(var index = 0; index < that.tags.length; index++){
            var tag = that.tags[index];
            if(tag == r_tag){
                tag_index = index;
                exists = true;
            }
        }

        if(exists) that.tags.splice(tag_index, 1);
        else {
            console.info("The tag "+ r_tag + " doesn't exists in this item: ", that.name, that);
        }
    };
    /**
     * Returns the sprite for an inventory item.
     * @returns {{background-image: string, background-position: string}}
     */
    this.get_item_background = function(){
        var style = {
            "background-image": "url(" + that.spritesheet +")",
            "background-position": that.img_x_p + "px " + that.img_y_p + "px"
        };

        return style;
    }
}
