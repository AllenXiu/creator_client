/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 14:02:20 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-16 18:09:18
 */

let ui_window = require("ui_window");
let constant = require("constant");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.UI,
    },

    // use this for initialization
    onLoad: function () {
        this.node.tag = this.args[0];
        this.node.getChildByName("Label").getComponent(cc.Label).string = `UI Test ${this.node.tag}`;
    },

    _register_handler: function () {
        
    },

    _unregister_handler: function () {
        
    }

});
