/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 18:00:17 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 18:17:23
 */

let utils = {};

/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive)
 * @returns {number}
 */
utils.get_random = function () {
    return Math.random();
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * @param min
 * @param max
 * @returns {*}
 */
utils.get_random_arbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Returns a random integer between min (included) and max (excluded)
 * Using Math.round() will give you a non-uniform distribution!
 * @param min
 * @param max
 * @returns {*}
 */
utils.get_random_int = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * 检测对象类型
 * @param: obj {JavaScript Object}
 * @param: type {String} 以大写开头的 JS 类型名
 * @return: {Boolean}
 */
utils.is = function (obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1) === type;
};

/**
 * 复制对象
 * @param: obj {JavaScript Object} 原始对象
 * @param: isDeep {Boolean} 是否为深拷贝
 * @return: {JavaScript Object} 返回一个新的对象
 */
utils.clone = function (obj, is_deep) {
    let ret = obj.slice ? [] : {}, p, prop;
    // 配合 is 函数使用
    if (!is_deep && utils.is(obj, 'Array')) return obj.slice();
    for (p in obj) {
        if (!obj.hasOwnProperty(p)) continue;
        prop = obj[p];
        ret[p] = (utils.is(prop, 'Object') || utils.is(prop, 'Array')) ?
            utils.clone(prop, is_deep) : prop;
    }
    return ret;
};

/**
 * 判断一个字符串是否是合法的角色名, 并返回trim过的字符串
 * 一个英文字符为宽度1，其它字符为宽度2，总宽度需要小于max_len
 */
utils.validate_name = function (str, max_len) {
    let ret = null;
    do {
        if (typeof(str) != "string") {
            break;
        }

        str = str.trim();
        if (str.length <= 0) {
            break;
        }

        let name_len = 0;
        let has_invalid_char = false;
        for (let i = 0; i < str.length; ++i) {
            let ch = str.charCodeAt(i);
            if (ch == 0x20/* */ || ch == 0x25/*%*/ || ch == 0x26/*&*/ || ch == 0x7c/*|*/) {
                has_invalid_char = true;
                break;
            }
            name_len += ch <= 255 ? 1 : 2;
        }

        if (has_invalid_char || name_len > max_len) {
            break;
        }
        ret = str;
    } while (false);
    return ret;
};

/**
 * 输出带颜色的 log, 不支持对象和数组
 * Chrome 环境
 * @param text {Not Object or Array}
 * @param color
 * @param bg_color
 */
utils.log = function (text, color, bg_color) {
    if (cc.sys.isBrowser && cc.sys.browserType === cc.sys.BROWSER_TYPE_CHROME) {
        color = color || cc.Color.BLUE;
        bg_color = bg_color || cc.Color.WHITE;
        cc.log("%c" + text, "background: #" + bg_color.toHEX("#rrggbb") + "; color: #" + color.toHEX("#rrggbb"));
    } else {
        cc.log(text);
    }
};

/**
 * 遍历对象中存在的属性条目
 * @param obj               遍历对象
 * @param keys              要遍历的属性列表
 * @param cb(key, value)    callback function for every property
 */
utils.foreach_key = function (obj, keys, cb) {
    if (!Array.isArray(keys) || typeof(obj) !== "object" || typeof(cb) !== "function") {
        cc.log("[WARN] utils.get_normal_prop_list: Invalid args");
        return;
    }
    for (let i in keys) {
        let key = keys[i];
        let value = obj[key];
        if (value) {
            cb(key, value);
        }
    }
};

/**
 * 格式化字符串，目前支持d和s
 */
utils.sprintf = function (str /*...*/) {
    let args = arguments;
    let argIndex = 1;
    return str.replace(/(%[ds])/g,
        function (m, i) {
            return args[argIndex++];
        });
};

utils.find = function (path, referenceNode) {
    if (path == null) {
        cc.error('Argument must be non-nil');
        return null;
    }
    if (!referenceNode) {
        let scene = cc.director.getScene();
        if (!scene) {
            if (CC_DEV) {
                cc.warn('Can not get current scene.');
            }
            return null;
        }
        else if (CC_DEV && !scene.isValid) {
            cc.warn('Scene is destroyed');
            return null;
        }
        referenceNode = scene;
    }
    else if (CC_DEV && !referenceNode.isValid) {
        cc.warn('reference node is destroyed');
        return null;
    }

    let match = referenceNode;
    let startIndex = (path[0] !== '/') ? 0 : 1; // skip first '/'
    let nameList = path.split('/');

    // parse path
    for (let n = startIndex; n < nameList.length; n++) {
        let name = nameList[n];
        let children = match._children;
        match = [];
        for (let t = 0, len = children.length; t < len; ++t) {
            let subChild = children[t];
            if (subChild.name === name) {
                match.push(subChild);
            }
        }
        if (!match) {
            return null;
        }
        if (match.length == 1) {
            match = match[0];
        }
    }

    return match;
};

/**
 * 获取ojbect中的所有value
 */
utils.object_values = function (o) {
    let v = [];
    for (let k in o) {
        if (o.hasOwnProperty(k)) {
            v.push(o[k]);
        }
    }
    return v;
};

/**
 * 获取平台
 * @returns {*}
 */
utils.get_platform = function () {
    let platform = cc.sys.os;
    if (platform != "Android" || platform != "iOS") {
        platform = "Other";
    }
    return platform;
};

/**
 * 使用颜色格式化富文本
 * @param text
 * @param hex_color
 * @returns {string}
 */
utils.format_rich_text_with_color = function (text, hex_color) {
    return "<color=" + hex_color + ">" + text + "</color>";
};

utils.string_format = function (str /*...*/) {
    var args = arguments;
    var argIndex = 1;
    return str.replace(/(%[ds])/g,
        function (m, i) {
            return args[argIndex++];
        });
};

/**
 * 获取时间格式
 */
utils.get_time_str = function (ts,_isSimple) {
    let _check_time = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    let hh = parseInt(ts / 60 / 60, 10);//计算剩余的小时数
    let mm = parseInt(ts / 60 % 60, 10);//计算剩余的分钟数
    let ss = parseInt(ts % 60, 10);//计算剩余的秒数
    let str = _isSimple ? "" : utils._check_time(hh) + ":";
    str += utils._check_time(mm) + ":" + utils._check_time(ss);
    return  str
};

/**
 * 战力的格式转换
 * @param power
 * @returns {*}
 */
utils.parse_power = function (power) {
    power = parseInt(power);
    if (power >= 100000) {
        power = parseInt(power / 10000) + "万"
    }
    return power;
};

utils.get_percent_symbol = function (property_name) {
  return property_name.substring(property_name.length - 4) === "rate" ? "%" : "";
};

let last_date = 0
utils.timing = function(msg) {
    let now = (new Date()).getTime();
    let delta = now - last_date;
    last_date = now;
    let sec = Math.floor(delta / 1000);
    let ms = delta - sec * 1000;
    cc.log(msg, "[now: " + now, ", using: ", sec + " s " + ms + " ms" + "]");
};


utils.md5 = function (_data) {
    let MD5 = require("md5");
    return MD5.hex_md5(_data);
};

utils.format_seconds = function (a) {
    let hh = parseInt(a / 3600);
    if (hh < 10) hh = "0" + hh;
    let mm = parseInt((a - hh * 3600) / 60);
    if (mm < 10) mm = "0" + mm;
    let ss = parseInt((a - hh * 3600) %60);
    if (ss < 10) ss = "0" + ss;
    let length = hh + ":" + mm + ":" + ss;
    if (a >= 0){
        return length;
    }else{
        return "NaN";
    }
};

module.exports = utils;