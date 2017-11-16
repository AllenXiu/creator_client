/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 14:02:20 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-16 17:22:54
 */

let ui_window = require("ui_window");
let constant = require("constant");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.TIP,
    },

    // use this for initialization
    onLoad: function () {
        //实现关闭逻辑
        this.node.runAction(cc.sequence(
            cc.moveBy(1, 0, 100),
            cc.removeSelf()
        ));
    },

    _register_handler: function () {
        
    },

    _unregister_handler: function () {
        
    }

});
