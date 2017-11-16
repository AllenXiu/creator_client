/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 14:02:04 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-16 17:17:58
 */

/**
 * ui_window 是所有prefab挂载的脚本的基类
 * window_type有以下四种类型
 * constant.WINDOW_TYPE.BASE：基础窗口。长期存在，不能关闭，可以同时有多个
 * constant.WINDOW_TYPE.UI: 全屏窗口。打开时底层的UI窗口会被disable, 底层的Popup窗口会被关闭。关闭时底层的UI窗口会被active
 * constant.WINDOW_TYPE.Popup: 非全屏窗口。打开时底层的Popup窗口会被关闭。
 * constant.WINDOW_TYPE.Tip: 提示条。需要自己实现关闭逻辑。
 */ 

let ui_window = cc.Class({

    extends: cc.Component,

    properties: {

    },

    onEnable: function () {
        this._register_handler && this._register_handler();
        if (!this.not_swallow_touched) {
            this.scheduleOnce(() => {
                this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                    event.stopPropagation();
                });
            });
            this.not_swallow_touched = true;
        }
    },

    onDisable: function () {
        this._unregister_handler && this._unregister_handler();
    },

    swallow_touch: function (cb) {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
            cb && cb();
        });
    }
});

module.exports = ui_window;