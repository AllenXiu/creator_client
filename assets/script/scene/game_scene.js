/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 18:31:31 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-20 15:53:28
 */

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        
    },

    on_click_scene: function (_, scene) {
        cc.director.loadScene(scene);
    }
});
