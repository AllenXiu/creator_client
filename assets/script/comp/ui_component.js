/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 14:48:47 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-16 15:43:16
 */

//这个组件必须置顶加载
let constant = require("constant");
let ui = require("ui");
let res = require("res");
let download = require("download");

cc.Class({
    extends: cc.Component,

    properties: {
        ui_prefabs: {
            default: [],
            type: cc.Class({
                name: "prefab_map",
                properties: {
                    name: "",
                    prefab: cc.Prefab,
                },
            }),
        },
        ui_icons: [cc.SpriteAtlas],
    },

    // use this for initialization
    onLoad: function () {
        //base_nodes
        this.base_nodes = {};

        //prefab_map
        this.prefab_map = {};
        this.ui_prefabs.forEach((info) => {
            if (info.name && info.prefab) {
                this.prefab_map[info.name] = info;
            }
        });

        download.load_atlas(this.ui_icons);
        this._register_handler();
    },

    _register_handler: function () {
        ui.on("open", (window_name, ...args) => {
            let ui_args = [];
            for (let i = 0; i < args.length - 1; i++) {
                ui_args.push(args[i]);
            }

            let do_open_ui = (prefab) => {
                if (this.base_nodes[window_name]) {
                    this._switch_to_base_node(window_name);
                    return;
                }
                let prefab_node = cc.instantiate(prefab);
                if (!prefab_node) {
                    cc.log("创建prefab失败");
                    return;
                }
                let controller = prefab_node.getComponent(window_name);
                if (!controller) {
                    cc.log("找不到prefab挂载的同名脚本");
                    return;
                }
                controller.args = ui_args;
                let window_type = controller.window_type;
                switch (window_type) {
                    case constant.WINDOW_TYPE.INVALID:
                        cc.log("错误的窗口类型");
                        break;
                    case constant.WINDOW_TYPE.BASE:
                        prefab_node.parent = this.node.getChildByName("base_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.BASE;
                        this.base_nodes[window_name] = prefab_node;
                        this._switch_to_base_node(window_name);
                        break;
                    case constant.WINDOW_TYPE.UI:
                        prefab_node.parent = this.node.getChildByName("ui_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.UI;
                        this._close_last_popup_ui();
                        this._inactive_last_ui();
                        ui.push({
                            window_name: window_name,
                            prefab_node: prefab_node,
                            window_type: window_type
                        });
                        break;
                    case constant.WINDOW_TYPE.POPUP:
                        prefab_node.parent = this.node.getChildByName("popup_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.POPUP;
                        this._close_last_popup_ui();
                        ui.push({
                            window_name: window_name,
                            prefab_node: prefab_node,
                            window_type: window_type
                        });
                        break;
                    case constant.WINDOW_TYPE.TIP:
                        prefab_node.parent = this.node.getChildByName("tip_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.TIP;
                        break;
                    default:
                        break;
                }
            };

            let prefab_info = this.prefab_map[window_name];
            if (prefab_info) {
                if (prefab_info.prefab) {
                    do_open_ui(prefab_info.prefab);
                } else {
                    cc.log("找不到prefab，请注册到ui_component.js", window_name);
                }
                return;
            }
            //  从resources/prefab目录中下载
            let uri = res.prefab[window_name + "_prefab"];
            uri = uri && uri.split(".prefab")[0];
            if (!uri) {
                cc.log("resources/prefab目录下找不到prefab", window_name);
                return;
            }
            cc.loader.loadRes(uri, (error, prefab) => {
                if (error) {
                    cc.log("下载prefab失败：", uri);
                    return;
                }
                this.prefab_map[window_name] = {
                    name: window_name,
                    prefab: prefab,
                };
                do_open_ui(prefab);
            });
        }, this.node);

        ui.on("close", () => {
            let last_window_info = ui.get_last_window_info();
            if (!last_window_info) {
                cc.log("场景中没有ui window和popup window了");
                return;
            }
            switch (last_window_info.window_type) {
                case constant.WINDOW_TYPE.INVALID:
                    cc.log("错误的窗口类型");
                    break;
                case constant.WINDOW_TYPE.BASE:
                    cc.log("base类型窗口不能被close");
                    break;
                case constant.WINDOW_TYPE.UI:
                    last_window_info.prefab_node.parent = null;
                    ui.pop();
                    this._active_last_ui();
                    break;
                case constant.WINDOW_TYPE.POPUP:
                    last_window_info.prefab_node.parent = null;
                    ui.pop();
                    break;
                case constant.WINDOW_TYPE.TIP:
                    cc.log("tip类型窗口无close事件");
                    break;
                default:
                    break;
            }
        }, this.node);
    },

    _switch_to_base_node: function (window_name) {
        for (let key in this.base_nodes) {
            if (this.base_nodes.hasOwnProperty(key)) {
                this.base_nodes[key].active = key === window_name;
            }
        }
        ui.close_all();
    },

    _inactive_last_ui: function () {
        let last_window_info = ui.get_last_window_info();
        if (!last_window_info) {
            return;
        }
        if (last_window_info.window_type === constant.WINDOW_TYPE.UI) {
            last_window_info.prefab_node.active = false;
        }
    },

    _active_last_ui: function () {
        let last_window_info = ui.get_last_window_info();
        if (!last_window_info) {
            return;
        }
        if (last_window_info.window_type === constant.WINDOW_TYPE.UI) {
            last_window_info.prefab_node.active = true;
        }
    },

    _close_last_popup_ui: function () {
        let last_window_info = ui.get_last_window_info();
        if (!last_window_info) {
            return;
        }
        if (last_window_info.window_type === constant.WINDOW_TYPE.POPUP) {
            last_window_info.prefab_node.parent = null;
            ui.pop();
        }
    },
});
