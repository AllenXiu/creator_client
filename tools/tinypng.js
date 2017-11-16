/*
 * @Author: JackyFu 
 * @Date: 2017-11-16 14:03:28 
 * @Last Modified by:   JackyFu 
 * @Last Modified time: 2017-11-16 14:03:28 
 */

var fs = require('fs');
var path = require('path');
var tinify = require("tinify");

var process_file_ext = ['png', 'jpg'];
var max_process_pic_count_per_key = 500;

var get_resources_file_list = function(dir, file_list) {
    var files = fs.readdirSync(dir);
    file_list = file_list || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            file_list = get_resources_file_list(dir + file + '/', file_list);
        }
        else {
            var ext_name = file.substring(file.lastIndexOf('.') + 1, file.length);
            var is_process_file = false;
            for (var i = 0; i < process_file_ext.length; i++) {
                if (process_file_ext[i] === ext_name) {
                    is_process_file = true;
                    break;
                }
            }
            if (is_process_file) {
                file_list.push(path.resolve(dir, file));

            }
        }
    });
    return file_list;
};

var main = function () {
    var arguments = process.argv.splice(2);
    if (arguments[0]) {
        tinify.key = arguments[0];
        var file_list = get_resources_file_list(__dirname + '/../client/assets/');
        console.log("总共需要处理" + file_list.length + "张图片");
        if (file_list.length > max_process_pic_count_per_key) {
            cc.log("处理的图片数量超过" + max_process_pic_count_per_key + "张，请联系Jacky修改脚本。。。O(∩_∩)0~");
            return;
        }
        for (var i = 0; i < file_list.length; i ++) {
            console.log('正在处理第' + (i+1) + '张: ' + file_list[i]);
            (function (index) {
                var source = tinify.fromFile(file_list[i]);
                source.toFile(file_list[index], function (err) {
                    if (!err) {
                        console.log("第" + (index + 1) + "张处理完成:" + file_list[index]);
                        console.log("=======>本月已压缩" + tinify.compressionCount + "张图片<=======");
                        return;
                    }
                    console.log("第" + (index + 1) + "张处理失败:" + file_list[index]);
                    if (err instanceof tinify.AccountError) {
                        console.log("The error message is: " + err.message);
                    } else if (err instanceof tinify.ClientError) {
                        console.log("Check your source image and request options.");
                    } else if (err instanceof tinify.ServerError) {
                        console.log(" Temporary issue with the Tinify API.");
                    } else if (err instanceof tinify.ConnectionError) {
                        console.log("A network connection error occurred.");
                    } else {
                        console.log("Something else went wrong, unrelated to the Tinify API.");
                    }
                });
            })(i);
        }
    }else{
        console.log("请输入TinyPNG API KEY");
    }
};

main();