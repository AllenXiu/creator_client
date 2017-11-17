import { disconnect } from "cluster";
import { unwatchFile } from "fs";

/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:43:53 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-17 15:44:00
 */

let network = cc.Class({
    extends: require("logic"),

    ctor: function () {

    },

    init_modules: function () {
    },

    init: function (ip, port) {
        this.ip = ip + ":" + port;
        this.sio = null;
    },

    connect: function (success_cb, failure_cb) {
        let opts = {
            'reconnection': false,
            'force new connection': true,
            'transports': ['websocket', 'polling']
        };

        this.sio = window.io.connect(this.ip, opts);

        this.sio.on('reconnect', () => {
            console.log('reconnection');
        });

        this.sio.on('connect', (data) => {
            console.log("connect ok");
            this.sio.connected = true;
            success_cb && success_cb(data);
        });

        this.sio.on('disconnect', (data) => {
            console.log("disconnect");
            this.sio.connected = false;
            this.close();
        });

        this.sio.on('connect_failed', (data) => {
            console.log('connect_failed');
            failure_cb && failure_cb(data);
        });

        this.sio.on('data', (data) => {
            this.handle_data(data);
        });
    },

    handle_data: function (msg) {
        if (typeof (msg) !== "string") {
            console.log("接收到的网络数据不是字符串");
        }
        try {
            msg = JSON.parse(msg);
            if (msg && msg.msg_name && msg.msg_data) {
                console.log("[net message receive]", msg.msg_name, msg.msg_data);
                this.emit(msg.msg_name, msg);
            } else {
                console.log("缺少 msg_name 或者 msg_data 字段");
            }
        } catch (error) {
            console.log(error);
        }
    },

    send: function (msg, event) {
        if (this.sio && this.sio.connected) {
            event = event ? event : "data";
            if (msg === null || (typeof (msg) != "object")) {
                console.log("发送数据异常");
                return false;
            }
            if (!msg.msg_name || !msg.msg_data) {
                console.log("缺少 msg_name 或者 msg_data 字段");
                return false;
            }
            let str_data = JSON.stringify(msg);
            console.log("[net message send]", msg.msg_name, msg.msg_data);
            this.sio.emit("data", str_data);
            return true;
        }
        else {
            console.log("socket-io no connect");
            return false;
        }
    },

    set_disconnect_cb: function (disconnect_cb) {
        this.disconnect_cb = disconnect_cb;
    },

    close: function () {
        console.log('close');
        if (this.sio && this.sio.connected) {
            this.sio.connected = false;
            this.sio.disconnect();
            this.sio = null;
        }
        if (this.disconnect_cb) {
            this.disconnect_cb();
            this.disconnect_cb = null;
        }
    },

    // http request
    get: function (msg_name, url, args) {
        //set arguments with <URL>?xxx=xxx&yyy=yyy
        url += "/";
        if (args) {
            url += "?";
            for (let key in args) {
                if (args.hasOwnProperty(key)) {
                    let arg = key + "=" + args[key];
                    url += arg + "&";
                }
            }
        }
        url = url.substring(0, url.length - 1);
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                // let httpStatus = xhr.statusText;
                let response = xhr.responseText;
                console.log(`Get 接收: ${response}`);
                try {
                    this.emit(msg_name + "_ret", JSON.parse(response));
                } catch (e) {
                    console.log(e);
                }
            }
        };
        xhr.send();
        console.log("Get 请求: " + url);
    },

    post: function (msg_name, url, args) {
        let data = "";
        if (args) {
            for (let key in args) {
                if (args.hasOwnProperty(key)) {
                    let arg = key + "=" + args[key];
                    data += arg + "&";
                }
            }
        }
        data = data.substring(0, data.length - 1);
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                // let httpStatus = xhr.statusText;
                let response = xhr.responseText;
                console.log(`Post 接收: ${response}`);
                try {
                    this.emit(msg_name + "_ret", JSON.parse(response));
                } catch (e) {
                    console.log(e);
                }
            }
        };
        xhr.send(data);
        console.log("Post 请求: " + url);
    },
});

module.exports = new network();