let fs = require('fs');
let path = require('path');

let file_list = [];

let walk = function(dir, file_list) {
    let files = fs.readdirSync(dir);
    file_list = file_list || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            file_list = walk(dir + file + '/', file_list);
        }
        else {
        	let file_name = path.resolve(dir, file);
        	if (file_name.endsWith('.prefab') || file_name.endsWith('.fire')) {
        		file_list.push(file_name);
        	}
        }
    });
    return file_list;
};

file_list = walk(__dirname + '/../assets/', file_list);

for (let i = 0; i < file_list.length; i ++) {
	let arr = JSON.parse(fs.readFileSync(file_list[i]));
	let btn_count = 0;
	for (let j = 0; j < arr.length; j ++) {
		let item = arr[j];
		if (item.__type__ === "cc.Button") {
			item.transition = 3;
			item.zoomScale = 1.1;
			btn_count ++;
		}
	}
	fs.writeFileSync(file_list[i], JSON.stringify(arr, null, 2));
	console.log(`处理文件 ${file_list[i]}, 共有 cc.Button ${btn_count} 个`);
}