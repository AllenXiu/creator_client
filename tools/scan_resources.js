#!/usr/bin/env node

var fs      = require("fs");
var path    = require("path");

//  扫描此目录下的所有文件
var RESOURCES_DIR = path.resolve(__dirname, "../assets/resources");

//  把文件列表写入此文件
var RES_FILE_PATH = path.resolve(__dirname, "../assets/script/util/res.js");

// 判断此文件名是否要记录，如果要记录则返回合适的key名
var IGNORE_LIST = [
    /_gsdata_/,
    "carnival.json",
    /effect_.*.plist/,
    /effect_.*.png/,
    "hurt_effect_ani.anim",
    // /role_.*.plist/,
    // /role_.*.png/,
    /.*_server.json/,
    /^task.json/,
    "recharge_guide.json",
    "reward_type.json",
    "reward.json",
    "robot_data.json",
    "pvp_data.json",
    /three_day_target.*.json/,
    "level_gift.json",
    /shop_[^2\n]*.json/,
    /shop_2_.*.json/,
    "statistics.json",
    "map.json",
    /\.meta$/,
	"id_define.json",
	"month_target.json"
];

function walk(dir, on_dir, on_file) {
    var list = fs.readdirSync(dir);

    list.forEach(function (item) {
        var offset = -1;
        for (var i = 0; i < IGNORE_LIST.length; ++i) {
            if (item.search(IGNORE_LIST[i]) !== -1) {
                return;
            }
        }

        var item_path = path.resolve(dir, item);

        var stat = fs.statSync(item_path);
        if (stat.isFile()) {
            on_file(item);
        }
        else if (stat.isDirectory()) {
            on_dir(item, true);
            walk(item_path, on_dir, on_file);
            on_dir(item, false);
        }
    });
}

var lines = [];
lines.push(`/*
*   !!! DON'T edit this file manually!!!
*   Please exec <repo_dir>/tools/scan_resources.js script to generate this file.
*/

module.exports = {
`)

var indents = ["    "];
var prefixs = [];
var ignore_exts = [
    "prefab",
    "png"
];

walk(RESOURCES_DIR, function(item, enter_dir) {
    if (enter_dir) {
        lines.push(indents.join("") + item + ": {");
        prefixs.push(item);
        indents.push("    ");
    }
    else {
        indents.pop();
        prefixs.pop();
        lines.push(indents.join("") + "},");
    }
}, function (item) {
    var full_stop_pos = item.indexOf(".");
    if (full_stop_pos === 0) {
        return;
    }
    let real_name = full_stop_pos < 0 ? item : item.substr(0, full_stop_pos);
    let ext_name = full_stop_pos < 0 ? "" : path.extname(item).substr(1);
    let item_key = full_stop_pos < 0 ? item : real_name + "_" + ext_name;
    lines.push(indents.join("") + item_key + ": \"" + prefixs.join("/") + "/" + (ignore_exts.includes(ext_name) ? real_name : item) + "\",");
});


lines.push("};");

fs.writeFileSync(RES_FILE_PATH, lines.join("\n"));

process.exit(0);