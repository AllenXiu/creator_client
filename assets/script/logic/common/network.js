/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:43:53 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 18:14:33
 */

let proto = null;
let tips  = null;
let utils = null;

let network_msg_list = [];
let URL = "http://www.google.com/";
 
let network = cc.Class({
    extends: require("logic"),

    ctor: function () {

    },

    init_modules: function () {
        proto = require("proto");
        tips  = require("tips");
        utils = require("utils");
    },

    init: function () {
        this.ip = "";
        this.sio = null;
        this.isPinging = false;
        this.fnDisconnect = null;
        this.loading_message_id = -1;
    },

    connect: function(_ip,fnConnect,fnError) {
        let opts = {
            'reconnection':false,
            'force new connection': true,
            'transports':['websocket', 'polling']
        };

        this.sio = window.io.connect(_ip, opts);
        
        this.sio.on('reconnect',() => {
            console.log('reconnection');
        });

        this.sio.on('connect', (data) => {
            cc.log("connect ok");
            this.sio.connected = true;
            fnConnect(data);
        });

        this.sio.on('disconnect', (data) => {
            console.log("disconnect");
            this.sio.connected = false;
            this.close();
        });

        this.sio.on('connect_failed', () => {
            console.log('connect_failed');
        });

        this.sio.on('data', (data) => {
            this.handle_data(data);
        });
    },

    handle_data: function (data) {
        if(typeof(data) === "string"){
            if (cc.sys.isNative) {
                data = data.substring(1, data.length - 1);
            }
            let msg_arr = data.split("&");
            let msg_data = {};
            for(let i = 0; i < msg_arr.length; i++){
                let item_arr = msg_arr[i].split("=");
                if (item_arr[0] === "body") {
                    if (cc.sys.isNative) {
                        item_arr[1] = "\"" + item_arr[1] + "\"";
                    }
                    msg_data[item_arr[0]] = JSON.parse(item_arr[1]);
                }else {
                    msg_data[item_arr[0]] = item_arr[1];
                }
            }
            if (this.loading_message_id + 1 == msg_data.messageId) {
                this.emit("hide_loading_node");
            }
            cc.log("net message back str...",proto[msg_data.messageId], JSON.stringify(msg_data));
            if(msg_data.respCode == 1){
                let _msg_data_body = msg_data.body;
                if (cc.sys.isNative) {
                    _msg_data_body = JSON.parse(msg_data.body)
                }
                this.emit(proto[msg_data.messageId], _msg_data_body);
            }
            else{
                if(msg_data.messageId == proto.battle_query + 1){
                    this.emit(proto[msg_data.messageId],null);
                }

                if (proto.error_code[msg_data.respCode]) {
                    tips.show(proto.error_code[msg_data.respCode]);
                }else {
                    tips.show("错误代码：" + msg_data.respCode);
                }

                cc.log("message error respCode =",msg_data.respCode);
            }
            if(network_msg_list.length > 0){
                this._send();
            }
        }
    },

    send: function(data, is_show_loading, event){
        if(this.sio.connected){
            event = event ? event : "data";
            is_show_loading = is_show_loading || false;
            if( data !== null && (typeof(data) === "object")){
                let data_str = "";
                if (data) {
                    for (let key in data) {
                        let arg = key + "=" ;
                        arg +=  typeof(data[key]) === "object" ? JSON.stringify(data[key]):data[key];
                        data_str += arg + "&";
                    }
                }
                data_str = data_str.substring(0, data_str.length - 1);
                // cc.log("message send", data.messageId ,data_str);

                if (event === "data") {
                    network_msg_list.push({message:data_str, message_id: data.messageId, is_show_loading: is_show_loading});
                    this._send();
                }
                else{
                    this.sio.emit(event,data_str);
                    if (is_show_loading) {
                        this.loading_message_id = data.messageId;
                        this.emit("show_loading_node");
                    }
                }
            }
        }
        else{
            cc.log("socket-io no connect");
        }
    },

    _send: function () {
        let msg = network_msg_list.shift();
        if (!msg){
            cc.log("no msg in list");
            return;
        }
        cc.log("net message send", msg.message_id, msg.message);
        this.sio.emit("data",msg.message);
        if (msg.is_show_loading) {
            this.loading_message_id = msg.message_id;
            this.emit("show_loading_node");
        }
    },

    close: function(){
        console.log('close');
        if(this.sio && this.sio.connected){
            this.sio.connected = false;
            this.sio.disconnect();
            this.sio = null;
        }
        if(this.fnDisconnect){
            this.fnDisconnect();
            this.fnDisconnect = null;
        }
    },

    // http request
    get: function (msg_name, sub_url, args) {
        //set arguments with <URL>?xxx=xxx&yyy=yyy
        let url = URL + sub_url + "/";
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
        xhr.onreadystatechange = function () {
            cc.eventManager.dispatchCustomEvent("hide_loading");
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                // let httpStatus = xhr.statusText;
                let response = xhr.responseText;
                utils.log("Get 接收:");

                try {
                    this.emit(msg_name + "_ret", JSON.parse(response));
                }catch (e){
                    cc.log(e);
                }
            }
        }.bind(this);
        xhr.send();
        utils.log("Get 请求: " + url);
    },

    post: function (msg_name, sub_url, args) {
        let url = URL + sub_url;
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

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                // let httpStatus = xhr.statusText;
                let response = xhr.responseText;
                cc.log("Post 接收:");
                try {
                    this.emit(msg_name + "_ret", JSON.parse(response));
                }catch (e) {
                    cc.log(e);
                }
            }
        }.bind(this);
        xhr.send(data);
        utils.log("Post 请求: " + url);
    },
});

module.exports = new network();