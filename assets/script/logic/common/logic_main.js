/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 17:43:32 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2017-11-15 18:23:15
 */

let proto =  require("proto");
for(let key in proto){
    if (proto.hasOwnProperty(key)) {
        let id = proto[key];
        proto[id] = key;
        if (id % 2 === 0) {
            proto[key] = key;
        }
    }
}

let logic_modules = [
    //common logic module
    "network",
    "ui",
    "download",
    "time"
    //game logic module
];

let game = {};
if (!CC_BUILD) {
    window.game = game;
}

for (let i = 0; i < logic_modules.length; i ++) {
    let mod_name = logic_modules[i];
    game[mod_name] = require(mod_name);
}
game.config = require("config");

for (let i = 0; i < logic_modules.length; i ++) {
    require(logic_modules[i]).init_modules();
    require(logic_modules[i]).register_handler();
    require(logic_modules[i]).init();
}

