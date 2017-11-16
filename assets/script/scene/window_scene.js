/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 14:37:17 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-16 18:23:49
 */

let ui = require("ui");

let ui_window_tag = 0;
let popup_window_tag = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        label_windows_stack: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        ui.open("base_test");
    },

    on_click_open_base_test: function () {
        ui.open("base_test");
    },

    on_click_open_ui_test: function () {
        ui.open("ui_test", ++ui_window_tag);
    },

    on_click_open_popup_test: function () {
        ui.open("popup_test", ++popup_window_tag);
    },

    on_click_open_tip_test: function () {
        ui.open("tip_test");
    },

    on_click_close: function () {
        ui.close();  
    },

    on_click_close_all: function () {
        ui.close_all();
    },

    on_click_return: function () {
        cc.director.loadScene("game");
    },

    update: function () {
        let str_stacks = '窗口信息日志: \n\n';
        let base_nodes = [];
        let ui_component = this.node.getComponent("ui_component");
        str_stacks += `Base: \n`
        for (let key in ui_component.base_nodes) {
            str_stacks += `[${key}, active: ${ui_component.base_nodes[key].active}]\n`;
        }
        str_stacks += `\nUI & Popup: \n`
        for (let i = 0; i < ui.ui_stack.length; i++) {
            str_stacks += `[${ui.ui_stack[i].window_name}_${ui.ui_stack[i].prefab_node.tag}, active: ${ui.ui_stack[i].prefab_node.active}]\n`;
        }
        this.label_windows_stack.string = str_stacks;
    }
});
