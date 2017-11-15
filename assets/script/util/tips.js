/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 18:16:09 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 18:20:04
 */

let constant = require("constant");

let tips = {};

tips.show = function (msg, color, outline, position) {
    let label_node = new cc.Node();
    label_node.color = color || cc.Color.WHITE;
    label_node.zIndex = 99999;
    label_node.width = 600;
    label_node.position = position || cc.p(constant.DESIGN_RESOLUTION.width/2, constant.DESIGN_RESOLUTION.height* 3/5);
    cc.game.addPersistRootNode(label_node);

    let label = label_node.addComponent(cc.Label);
    label.string = msg || "";
    label.fontSize = 30;
    label.lineHeight = 40;
    label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    label.overflow = cc.Label.Overflow.NONE;

    let label_outline = label_node.addComponent(cc.LabelOutline);
    label_outline.color = color || cc.Color.BLACK;
    label_outline.width = 2;

    let delay_time = 1.0;
    let dismiss_time = 0.5;
    let action = cc.sequence(cc.delayTime(delay_time), cc.spawn(cc.moveBy(dismiss_time, 0, 200), cc.fadeOut(dismiss_time)), cc.removeSelf());
    label_node.runAction(action);
};

tips.error = function (msg) {
    tips.show(msg, constant.FONT_COLOR.RED, constant.FONT_OUTLINE_COLOR.RED);
};

tips.no_imp = function () {
    this.show("该功能暂未实现");
};

module.exports = tips;