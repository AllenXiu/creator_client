/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:44:22 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-16 17:38:11
 */

let ui = cc.Class({

    extends: require("logic"),

    ctor: function () {

    },

    init: function () {
        //只负责管理 ui_nodes 和 popup_nodes
        //主要用于窗口关闭
        this.ui_stack = [];
    },

    open: function (window_name, ...args) {
        this.emit("open", window_name, ...args);
    },

    close: function (...args) {
        if (this.ui_stack.length <= 0) {
            cc.log("场景中已经没有窗口了");
            return;
        }
        this.emit("close", this.ui_stack[this.ui_stack.length - 1].window_name, ...args);
    },

    close_all: function () {
        while (this.ui_stack.length > 0) {
            this.emit("close");
        }
    },

    push: function (window_info) {
        this.ui_stack.push(window_info);
    },

    get_last_window_info: function () {
        if (this.ui_stack.length <= 0) {
            return;
        }
        return this.ui_stack[this.ui_stack.length - 1];
    },

    pop: function () {
        return this.ui_stack.pop();
    }
});

module.exports = new ui();