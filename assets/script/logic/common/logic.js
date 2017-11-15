/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:43:45 
 * @Last Modified by:   JackyFu 
 * @Last Modified time: 2017-11-15 17:43:45 
 */

module.exports = cc.Class({
    _event_handler: null,

    ctor: function () {
        this._event_handler = new cc.EventTarget();
    },

    init_modules: function () {

    },

    init: function () {

    },

    register_handler: function () {

    },

    on: function (event_name, cb, node) {
        this._event_handler.on(event_name, (event) => {
            let args = [];
            for (let i = 0; i < event.detail.length; i ++) {
                args.push(event.detail[i]);
            }
            args.push(event);
            cb.apply(null, args);
    }, node);
    },

    once: function (event_name, cb, node) {
        this._event_handler.once(event_name, (event) => {
            let args = [];
            for (let i = 0; i < event.detail.length; i ++) {
                args.push(event.detail[i]);
            }
            args.push(event);
            cb.apply(null, args);
    }, node);
    },

    emit: function (event_name, ...params) {
        this._event_handler.emit(event_name, params);
    },

    off: function (target_node) {
        this._event_handler.targetOff(target_node);
    },

});