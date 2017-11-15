/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:44:15 
 * @Last Modified by:   JackyFu 
 * @Last Modified time: 2017-11-15 17:44:15 
 */

let time = cc.Class({

    extends: require("logic"),

    init: function () {

    },

    init_modules: function () {

    },

    register_handler: function () {

    },

    now: function () {
        return this.time();
    },

    time: function (time_info) {
        let dt = null;
        if (time_info === undefined) {
            // default
            dt = new Date();
        } else if (time_info.year) {
            //  lua format
            dt = new Date(time_info.year, time_info.month - 1, time_info.day, time_info.min, time_info.sec);
        } else {
            //  js format
            dt = time_info;
        }
        return Math.floor(dt.getTime() / 1000);
    }

});

module.exports = new time();