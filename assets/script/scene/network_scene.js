/*
 * @Author: JackyFu 
 * @Date: 2017-11-17 10:38:36 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-17 15:39:08
 */

let network = require("network");

const URL = "http://127.0.0.1:8080/";
const GET_REQ_MSG_NAME = "get_request";
const POST_REQ_MSG_NAME = "post_request";
const WS_MSG_NAME = "ws_msg_test";

cc.Class({
    extends: cc.Component,

    properties: {
        label_network_log: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
    },

    onEnable: function () {
        network.on(GET_REQ_MSG_NAME + "_ret", (msg) => {
            this.label_network_log.string += `\n${GET_REQ_MSG_NAME}_ret: ${JSON.stringify(msg, null, 2)}`;
        }, this.node);
        network.on(POST_REQ_MSG_NAME + "_ret", (msg) => {
            this.label_network_log.string += `\n${POST_REQ_MSG_NAME}_ret: ${JSON.stringify(msg, null, 2)}`;
        }, this.node);
        network.on(WS_MSG_NAME + "_ret", (msg) => {
            this.label_network_log.string += `\nreceive ${WS_MSG_NAME}_ret`;
        }, this.node)
    },

    onDisable: function () {
        network.off(this.node);
    },

    on_click_get_request: function () {
        network.get(GET_REQ_MSG_NAME, URL + "get", {msg: "get_request"});
    },

    on_click_post_request: function () {
        network.post(POST_REQ_MSG_NAME, URL + "post", { msg: "post_request" });
    },

    on_click_ws_connect: function () {
        network.init("127.0.0.1", 8080);
        network.set_disconnect_cb((data)=>{
            this.label_network_log.string += "\nws disconnect";
        });
        network.connect(
            (data) => {
                this.label_network_log.string += "\nws connect success";
            },
            (data) => {
                this.label_network_log.string += "\nws connect failed";
            }
        );
    },

    on_click_ws_send: function () {
        let is_send = network.send({
            msg_name: WS_MSG_NAME, 
            msg_data: {
                data_0: 0,
                data_1: "str"
            }
        });
        if (is_send) {
            this.label_network_log.string += `\nsend ${WS_MSG_NAME}`;    
        }
    },

    on_click_ws_close: function () {
        network.close();
    },

    on_click_clear_log: function () {
        this.label_network_log.string = "";
    }
});
