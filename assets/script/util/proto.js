/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:58:34 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 18:20:32
 */

let proto = {};

//send
proto.connect_server            = 1;

//receive
proto.connect_server_ret            = 2;

//error code
proto.error_code = {
    "1"    : "操作成功",
    "2"    : "系统错误",
};

module.exports = proto;