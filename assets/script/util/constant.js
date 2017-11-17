/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:56:52 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-17 15:58:03
 */

let constant = {};

constant.DESIGN_RESOLUTION = {
    width: 960,
    height: 640
};

constant.WINDOW_TYPE = {
    INVALID: -1,
    BASE: 0,
    UI: 1,
    POPUP: 2,
    TIP: 3
};

constant.WINDOW_ZINDEX = {
    INVALID: -1,
    BASE: 0,
    UI: 1,
    POPUP: 2,
    TIP: 3,
};

constant.FONT_SIZE = {
    SMALL: 24,
    NORMAL: 28,
    LARGE: 32,
};

//字体品质颜色
constant.FONT_QUALITY_COLOR = [
    cc.color(231, 197, 173),
    cc.color(32, 171, 93),
    cc.color(69, 139, 239),
    cc.color(221, 113, 251),
    cc.color(255, 171, 39),
    cc.color(255, 70, 70)
];

//字体描边品质颜色
constant.FONT_OUTLINE_QUALITY_COLOR = [
    cc.color(33, 9, 9),
    cc.color(10, 38, 6),
    cc.color(6, 10, 38),
    cc.color(29, 3, 36),
    cc.color(62, 21, 4),
    cc.color(45, 3, 3)
];

//字体颜色
constant.FONT_COLOR = {
    GREEN: cc.color(32, 171, 93),
    RED: cc.color(232, 83, 75),
    WHITE: cc.color(255, 255, 255),
    GRAY: cc.color(150, 150, 150),
};

//字体颜色对应描边
constant.FONT_OUTLINE_COLOR = {
    GREEN: cc.color(26, 106, 22),
    RED: cc.color(136, 38, 38),
    WHITE: cc.color(113, 113, 113),
    GRAY: cc.color(80, 80, 80)
};

module.exports = constant;