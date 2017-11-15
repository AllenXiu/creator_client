/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 16:16:15 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 16:22:29
 */

let Socket = {
    web_socket: null,
    send: function (data) {
        if (this.web_socket && this.web_socket.readyState === WebSocket.OPEN) {
            this.web_socket.send(data);
            return null; // no error
        }

        return null; // 错误系统暂时不引入
    },

    connect: function (ip, port, callback) {
        setTimeout(() => {
            let socketUrl = "ws://" + ip + ":" + port + "/s";

            if (this.web_socket) {
                this.web_socket.close();
            }

            this.web_socket = new WebSocket(socketUrl);
            this.web_socket.binaryType = "arraybuffer";

            console.log("try to connect ws ", socketUrl);

            this.web_socket.onmessage = function (event) {
                if (event.currentTarget !== this.web_socket) {
                    return;
                }
                console.log("onmessage------------");
                callback(Socket.eventType.onmessage, event);
            }.bind(this);

            this.web_socket.onopen = function (event) {
                if (event.currentTarget !== this.web_socket) {
                    return;
                }
                console.log("onopen------------");
                callback(Socket.eventType.onopen, event);
            }.bind(this);

            this.web_socket.onclose = function (event) {
                if (event.currentTarget !== this.web_socket) {
                    return;
                }
                console.log("onclose------------");
                this.web_socket = null;
                callback(Socket.eventType.onclose, event);
            }.bind(this);

            this.web_socket.onerror = function (event) {
                if (event.currentTarget !== this.web_socket) {
                    return;
                }
                console.log("onerror------------");
                callback(Socket.eventType.onerror, event);
            }.bind(this);
        }, 0);

        return this;
    },

    close: function () {
        if (!this.web_socket) {
            return;
        }

        this.web_socket.close();
        this.web_socket = null;
    }
};

Socket.eventType = {
    "onmessage": 1,
    "onopen": 2,
    "onclose": 3,
    "onerror": 4
};

module.exports = Socket;
