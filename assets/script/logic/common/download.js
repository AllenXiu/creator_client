/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 16:55:36 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-20 17:23:08
 */

let res = null;
let config = null;

let download = cc.Class({

    extends: require("logic"),

    ctor: function () {
        this.json_loaded = false;
        this.res_map = {};
        this.sprite_map = {};
    },

    init: function () {

    },

    init_modules: function () {
        res = require("res");
        config = require("config");
    },

    register_handler: function () {

    },

    /**
     * 异步加载所有的json表
     * 把map形式的json表中的所有行都添加到config上，id做为key
     */
    load_json: function (progress_cb, finish_cb) {
        if (this.json_loaded) {
            finish_cb && finish_cb();
            return;
        }
        let json_array = Object.keys(res.data).map((key) => {
            return res.data[key];
        });
        if (json_array.length <= 0) {
            cc.log("没有需要加载的json表");
            finish_cb();
            return;
        }
        this._download(json_array, (percent, res_name) => {
            progress_cb && progress_cb(percent, res_name);
        }, () => {
            json_array.filter((key) => {
                key = key.split(".")[0];
                let key2id = {};    //  如果表中有id 和key，在config上建立它们的映射表
                let m = Array.isArray(this.res_map[key]) ? {} : this.res_map[key];
                Object.keys(m).filter((k) => {
                    let row = m[k];
                    if (config[row.id]) {
                        cc.log("config id conflict:", row.id, config[row.id], row);
                    }
                    config[row.id] = row;
                    if (row.key) {
                        key2id[row.key] = row.id;
                    }
                });
                config[key.split("/")[1].toUpperCase() + "_ID"] = key2id;
            });
            this.json_loaded = true;
            finish_cb && finish_cb();
        });
    },

    /**
     * 异步加载所有的prefab
     */
    load_prefab: function (progress_cb, finish_cb) {
        let prefab_array = [];
        let prefab_map = res.prefab;
        for (let k in prefab_map) {
            let uri = prefab_map[k];
            uri = uri && uri.split(".prefab")[0];
            if (!uri) {
                continue;
            }
            prefab_array.push(uri);
        }
        let total_count = prefab_array.length;
        if (total_count <= 0) {
            finish_cb && finish_cb();
            return;
        }
        let download_prefab = (idx) => {
            let uri = prefab_array[idx];
            if (!uri) {
                finish_cb && finish_cb();
                return;
            }
            ((idx)=>{
                cc.loader.loadRes(uri, (error, prefab) => {
                    if (error) {
                        //  如果下载出错，重新下载
                        prefab_array.push(uri);
                    }
                    progress_cb && progress_cb(idx/total_count, uri);
                    download_prefab(idx + 1);
                });
            })(idx);
        };
        download_prefab(0);
    },

    /**
     * 由编辑器同步加载指定的spriteatlas，一般是icons
     * 然后塞到sprite_map中
     */
    load_atlas: function (atlas_array, progress_cb, finish_cb) {
        if (!Array.isArray(atlas_array)) {
            finish_cb && finish_cb();
            return;
        }
        atlas_array.forEach((atlas, index) => {
            atlas && atlas.getSpriteFrames().forEach((frame) => {
                this.sprite_map[frame.name] = frame;
            });
            progress_cb && progress_cb((index + 1) / atlas_array.length, atlas.name);
        });
        finish_cb && finish_cb();
    },

    get_icon: function (icon_id) {
        return this.sprite_map["icon_" + icon_id];
    },

    //  下载一个需要下载的文件列表
    _download: function (group, progress_callback, finish_callback) {
        if (!finish_callback) {
            finish_callback = progress_callback;
            progress_callback = null;
        }
        let progress = 0;

        let plistArray = [];
        for (let i = 0; i < group.length; ++i) {
            let item = group[i];
            if (item.indexOf(".plist") != -1) {
                plistArray.push(item.split(".plist")[0]);
            }
        }

        for (let i = 0; i < plistArray.length; ++i) {
            let png = plistArray[i] + ".png";
            for (let j = 0; j < group.length; ++j) {
                let item = group[j];
                if (item.indexOf(png) != -1) {
                    group.splice(j, 1);
                }
            }
        }

        let total = Array.isArray(group) ? group.length : 1;

        let loadFunc = function (res) {
            let type = res.indexOf(".plist") != -1 ? cc.SpriteAtlas : null;

            res = res.split(".")[0];
            cc.loader.loadRes(res, type, (err, data) => {
                if (err) {
                    cc.log("load " + res + " failed");
                }
                else {
                    //根据类型存储资源
                    this.res_map[res] = data;
                    switch (type) {
                        case cc.SpriteAtlas:
                            let frames = data.getSpriteFrames();
                            for (let i = 0; i < frames.length; ++i) {
                                let frame = frames[i];
                                this.sprite_map[frame.name] = frame;
                            }
                            break;
                        default:
                            break;
                    }
                }

                if (progress_callback) {
                    progress_callback((progress + 1) / total, res, data);
                }
                progress++;
                if (progress < total) {
                    // loadFunc(group[progress]);
                } else {
                    if (finish_callback) {
                        finish_callback();
                    }
                }

            });
        };
        for (let i = 0; i < group.length; ++i) {
            loadFunc.call(this, group[i]);
        }
    },

});

module.exports = new download();