/*
 * @Author: JackyFu 
 * @Date: 2017-11-20 16:04:46 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-20 17:11:57
 */

let download = require("download");

cc.Class({
    extends: cc.Component,

    properties: {
        label_resource_log: cc.Label,
        sprite_atlas_array: [cc.SpriteAtlas]
    },

    // use this for initialization
    onLoad: function () {
        download.json_loaded = false;
    },

    on_click_load_json: function () {
        this.on_click_clear_log();
        download.load_json(
            (percent, res_name) => {
                this.label_resource_log.string += `\ndownload json: \n${res_name}, ${(percent * 100).toFixed(2)}%`;
            },
            () => {
                this.label_resource_log.string += `\ndownload json finished.`;
            }
        );
    },

    on_click_load_prefab: function () {
        this.on_click_clear_log();
        download.load_prefab(
            (percent, res_name) => {
                this.label_resource_log.string += `\ndownload prefab: \n${res_name}, ${(percent * 100).toFixed(2)}%`;
            },
            () => {
                this.label_resource_log.string += `\ndownload prefab finished.`;
            }
        );
    },

    on_click_load_atlas: function () {
        this.on_click_clear_log();
        download.load_atlas(this.sprite_atlas_array,
            (percent, res_name) => {
                this.label_resource_log.string += `\ndownload atlas: \n${res_name}, ${(percent * 100).toFixed(2)}%`;
            },
            () => {
                this.label_resource_log.string += `\ndownload atlas finished.`;
        });
    },

    on_click_return: function () {
        cc.director.loadScene("game");
    },

    on_click_clear_log: function () {
        this.label_resource_log.string = "资源加载日志：";
    },
});
