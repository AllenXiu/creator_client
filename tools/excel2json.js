let fs      = require('fs');
let path    = require('path');
let crypto  = require('crypto');
let xlsx    = require('node-xlsx');

let IGNORE_FILE_ARRY = ["表格说明.xlsx", "经济数值.xlsx", "^~"];
let FILTER_EXT_ARRAY = ["xlsx"];
let IGNORE_FEILD_ARRAY = ["note"];
let WORKING_PATH = "../";

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is  , return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                // NOTE: === provides the correct "SameValueZero" comparison needed here.
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

let walk_folder = function(dir, ignore_file_array, filter_ext_array) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk_folder(file), ignore_file_array, filter_ext_array);
        }else {
            let file_name = file.substring(file.lastIndexOf("/") + 1, file.length);
            let ext_name = file.substring(file.lastIndexOf(".") + 1, file.length);
            for (let i = 0; i < ignore_file_array.length; i ++) {
                if (file_name.search(ignore_file_array[i]) !== -1) {
                    return;
                }
            }
            if (!filter_ext_array.includes(ext_name)) {
                return;
            }
            results.push(file);
        }
    });
    return results;
};

let delete_folder = function(path) {
    let files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                delete_folder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

let create_foler = function (path) {
	if(!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

let excel2json = function(file_name) {

    console.log("开始处理：" + file_name);

    let excel_data = xlsx.parse(file_name);

    if (!excel_data || !Array.isArray(excel_data)) {
        console.log("解析Excel文件失败，文件名是：" + file_name);
        return;
    }

    let sheet_data = excel_data[0];

    if (!sheet_data) {
        console.log("解析表格失败");
        return;
    }
    sheet_data = sheet_data.data;
    if (!Array.isArray(sheet_data)) {
        console.log("解析表格失败");
        return;
    }

    let json_text = "";
    let sheet_title = sheet_data[1];
    if (sheet_data.length) {
        if (sheet_title[0] === "id") {
            json_text += "{\n";
        }else {
            json_text += "[\n";
        }
    }
    for (let i = 2; i < sheet_data.length; i ++) {
        let row_data = sheet_data[i];
        if(row_data[0]) {
            if (sheet_title[0] === "id") {
                json_text += "\t\"" + row_data[0] + "\":{";
            }else {
                json_text += "\t\{";
            }
            for (let j = 0; j < row_data.length; j++) {
                if (typeof (row_data[j]) === "undefined") {
                    continue;
                } else {
                    let is_ignore_feild = false;
                    for (let k = 0; k < IGNORE_FEILD_ARRAY.length; k++) {
                        if (sheet_title[j].search(IGNORE_FEILD_ARRAY[k]) !== -1) {
                            is_ignore_feild = true;
                            break;
                        }
                    }
                    if (is_ignore_feild) {
                        continue;
                    } else {
                        json_text += "\"" + sheet_title[j] + "\":" + row_data[j] + ", ";
                    }
                }

            }
            json_text = json_text.substr(0, json_text.length - 2);
            json_text += "},\n";
        }
    }
    if (sheet_data.length) {
        json_text = json_text.substr(0, json_text.length - 2);
        if (sheet_title[0] === "id") {
            json_text += "\n}";
        }else {
            json_text += "\n]";
        }
    }

    file_name = file_name.substring(file_name.lastIndexOf("/") + 1, file_name.length);
    file_name = file_name.substring(0, file_name.lastIndexOf("."));
    fs.writeFileSync(path.join(WORKING_PATH, 'json', file_name + ".json"), json_text, 'utf-8');
}


let get_file_md5 = function(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

let genenrate_excel_md5 = function(md5_file_name) {
    let excel_files = walk_folder(path.join(WORKING_PATH, "excel"), IGNORE_FILE_ARRY, FILTER_EXT_ARRAY);
        let excel_md5_obj = {};
        for (let i = 0;i < excel_files.length; i ++) {
            let file_data = fs.readFileSync(path.join(WORKING_PATH, excel_files[i]));
            let name = excel_files[i].substring(excel_files[i].lastIndexOf('/') + 1, excel_files[i].length);
            name = name.substring(0, name.indexOf('.'));
            excel_md5_obj[name] = get_file_md5(file_data);
        }
    fs.writeFileSync(md5_file_name, "module.exports = \n" + JSON.stringify(excel_md5_obj, null, 2), "utf-8");
}

let genenrate_empty_excel_md5 = function (md5_file_name) {
    fs.writeFileSync(md5_file_name, "module.exports = {}", "utf-8");
}

let main = function () {
    let args = process.argv.splice(2);
    WORKING_PATH = args[0] || "";

    //delete_folder(path.join(WORKING_PATH, "json"));
    //create_foler(path.join(WORKING_PATH, "json"));

    let md5_file_name = path.join(WORKING_PATH, "excel", "file_md5.js")
    if (!fs.existsSync(md5_file_name)) {
        genenrate_empty_excel_md5(md5_file_name);
    }
    let excel_md5_obj = require('./' + md5_file_name);

    if(args[1]) {
        let origin_file_name = path.join(WORKING_PATH, "excel", args[1]);
        let file_name = origin_file_name.substring(origin_file_name.lastIndexOf('/') + 1, origin_file_name.length);
        file_name = file_name.substring(0, file_name.indexOf('.'));
        let excel_md5_str = excel_md5_obj[file_name];
        let file_data = fs.readFileSync(origin_file_name);
        if (get_file_md5(file_data) !== excel_md5_str) {
            excel2json(origin_file_name);
        }else {
            console.log(origin_file_name + " 不需要重新生成");
        }
        
    }else {
        let excel_files = walk_folder(path.join(WORKING_PATH, "excel"), IGNORE_FILE_ARRY, FILTER_EXT_ARRAY);
        for (let i = 0; i < excel_files.length; i++) {
            let origin_file_name = excel_files[i];
            let file_name = origin_file_name.substring(origin_file_name.lastIndexOf('/') + 1, origin_file_name.length);
            file_name = file_name.substring(0, file_name.indexOf('.'));
            let excel_md5_str = excel_md5_obj[file_name];
            let file_data = fs.readFileSync(origin_file_name);
            if (get_file_md5(file_data) !== excel_md5_str) {
                excel2json(excel_files[i]);
            }else {
                // console.log(origin_file_name + " 不需要重新生成");
            }
        }
    }
    genenrate_excel_md5(md5_file_name);
}

main();