/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:46:38 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 17:54:07
 */

let constant = require("constant");

let cocos_ext = {};

let _is = function (obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1) === type;
};

/**
 * 通过路径字符串获取节点
 * @param node
 * @param name
 * @returns {*}
 */
cocos_ext.getChildByName = function (node, name) {
    let name_array = name.split(/\s*\//);
    let ret_node = node;
    while (name_array.length) {
        ret_node = ret_node.getChildByName(name_array.shift());
    }
    return ret_node;
};

/**
 * 设置 label 文本属性
 * @param label
 * @param text
 * @param color
 */
cocos_ext.set_label_text = function (label, text, color) {
    label.getComponent(cc.Label).string = text;
    if (color) {
        label.color = color;
    }
};

/**
 * 设置 label 带描边文本属性
 * @param {*} label 
 * @param {*} text 
 * @param {*} color 
 * @param {*} outline_color 
 */
cocos_ext.set_label_text_with_outline = function (label, text, color, outline_color) {
    label.getComponent(cc.Label).string = text;
    if (color) {
        label.color = color;
    }
    if (outline_color) {
        label.getComponent(cc.LabelOutline).color = outline_color;
    }
};

/**
 * 设置 label 带品质的文本属性
 * @param {*} label 
 * @param {*} text 
 * @param {*} quality 
 */
cocos_ext.set_label_text_with_quality = function (label, text, quality) {
    if (label.getComponent(cc.LabelOutline)) {
        this.set_label_text_with_outline(label, text, constant.FONT_QUALITY_COLOR[quality], constant.FONT_OUTLINE_QUALITY_COLOR[quality]);
    } else {
        this.set_label_text(label, text, constant.FONT_QUALITY_COLOR[quality]);
    }
};

/**
 * 设置 richtext 文本属性
 * @param {*} label 
 * @param {*} text 
 * @param {*} color 
 */
cocos_ext.set_rich_label_text = function (label, text, color) {
    label.getComponent(cc.RichText).string = text;
    if (color) {
        label.color = color;
    }
};

/**
 * 设置进度条进度
 * @param {*} progress 
 * @param {*} value 
 */
cocos_ext.set_progress_value = function (progress, value) {
    progress.getComponent(cc.ProgressBar).progress = value;
};

/**
 * 设置 sprite sprite_frame
 * @param sprite
 * @param sprite_frame
 */
cocos_ext.set_sprite_frame = function (sprite, sprite_frame) {
    sprite.getComponent(cc.Sprite).spriteFrame = sprite_frame;
};

/**
 * 异步设置 spirte sprite_frame
 * @param {*} sprite 
 * @param {*} file_path 
 */
cocos_ext.set_sprite_frame_asyn = function (sprite, file_path) {
    cc.loader.loadRes(file_path, function (err, texture2d) {
        if (err) {
            cc.warn(err.message);
            return;
        }
        sprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture2d);
    });
};

cocos_ext.set_sprite_texture = function (sprite, texture2d) {
    sprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture2d);
};

/**
 * 设置 button 可用
 * @param button 
 * @param enable 
 */
cocos_ext.set_button_enable = function (button, enable) {
    button.getComponent(cc.Button).interactable = enable;
};

/**
 * 设置 button 数据
 * @param {} button 
 * @param {} data 
 */
cocos_ext.set_button_data = function (button, data) {
    button.getComponent(cc.Button).clickEvents[0].customEventData = data;
};

/**
 * 创建一个文本
 * @param string
 * @param color
 * @param font_size
 * @param anchor_x
 * @param anchor_y
 * @returns {cc.Node|any}
 */
cocos_ext.create_label = function (string, color, font_size, anchor_x, anchor_y) {
    string = string || "";
    color = color || cc.Color.WHITE;
    font_size = font_size || 18;
    anchor_x = _is(anchor_x, "Number") ? anchor_x : 0.5;
    anchor_y = _is(anchor_y, "Number") ? anchor_y : 0.5;
    let label_node = new cc.Node();
    label_node.color = color;
    label_node.anchorX = anchor_x;
    label_node.anchorY = anchor_y;
    let label_component = label_node.addComponent(cc.Label);
    label_component.fontSize = font_size;
    label_component.lineHeight = font_size + 2;
    label_component.string = string;
    return label_node;
};

/**
 * 创建一个富文本
 * @param string
 * @param font_size
 * @param anchor_x
 * @param anchor_y
 * @returns {cc.Node|any}
 */
cocos_ext.create_rich_label = function (string, font_size, anchor_x, anchor_y) {
    string = string || "";
    font_size = font_size || 18;
    anchor_x = _is(anchor_x, "Number") ? anchor_x : 0.5;
    anchor_y = _is(anchor_y, "Number") ? anchor_y : 0.5;
    let label_node = new cc.Node();
    label_node.anchorX = anchor_x;
    label_node.anchorY = anchor_y;
    let label_component = label_node.addComponent(cc.RichText);
    label_component.fontSize = font_size;
    label_component.lineHeight = font_size + 2;
    label_component.string = string;
    return label_node;
};

/**
 * 创建一个sprite
 * @param sprite_frame
 * @returns {cc.Node|any}
 */
cocos_ext.create_sprite = function (sprite_frame) {
    let sprite_node = new cc.Node();
    let sprite_component = sprite_node.addComponent(cc.Sprite);
    sprite_component.spriteFrame = sprite_frame;
    return sprite_node;
};

/**
 * 创建一个按钮
 * @param sprite_frame
 * @param target
 * @param component_name
 * @param handler_name
 * @returns {cc.Node|any}
 */
cocos_ext.create_button = function (sprite_frame, target, component_name, handler_name) {
    let button_node = new cc.Node();
    let sprite_component = button_node.addComponent(cc.Sprite);
    sprite_component.spriteFrame = sprite_frame;
    let button_component = button_node.addComponent(cc.Button);
    let event_handler = new cc.Component.EventHandler();
    event_handler.component = component_name;
    event_handler.handler = handler_name;
    event_handler.target = target;
    button_component.clickEvents.push(event_handler);
    return button_node;
};

/**
 * 全屏吞噬触摸
 * @param node
 * @param cb
 */
cocos_ext.swallow_touch_full_screen = function (node, cb) {
    node.on(cc.Node.EventType.TOUCH_START, function (event) {
        event.stopPropagation();
        cb && cb();
    });
};

/**
 * 指定区域吞噬触摸
 * @param node
 * @param bg_node
 * @param cb
 */
cocos_ext.swallow_touch_with_region = function (node, bg_node, cb) {
    node.on(cc.Node.EventType.TOUCH_START, function (event) {
        let local_touch_location = bg_node.convertToNodeSpaceAR(event.touch.getLocation());
        if (Math.abs(local_touch_location.x) > bg_node.width / 2 ||
            Math.abs(local_touch_location.y) > bg_node.height / 2) {
            cb && cb();
        }
        event.stopPropagation();
    });
};

/**
 * 播放动画
 * @param {*} node 
 * @param {*} animation_name 
 */
cocos_ext.play_animation = function (node, animation_name) {
    node.getComponent(cc.Animation).play(animation_name);
};

module.exports = cocos_ext;