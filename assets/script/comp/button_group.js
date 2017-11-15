/*
 * @Author: JackyFu 
 * @Date: 2017-11-15 16:04:22 
 * @Last Modified by:   JackyFu 
 * @Last Modified time: 2017-11-15 16:04:22 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        buttons: {
            default: [],
            type: cc.Class({
                name: "buttons",
                properties: {
                    button: cc.Button,
                    normal_sprite_frame: cc.SpriteFrame,
                    pressed_sprite_frame: cc.SpriteFrame,
                    sprite: cc.Sprite,
                    label: cc.Label,
                    name: "",
                },
            }),
        },
        normal_text_color: cc.Color,
        pressed_text_color: cc.Color,
        default_index: 0
    },

    // use this for initialization
    onLoad: function () {
        for (let i = 0; i < this.buttons.length; i ++) {
            if(this.buttons[i].button.transition !== cc.Button.Transition.NONE && this.buttons[i].button.transition !== cc.Button.Transition.SCALE) {
                cc.log("The button transition is not none or scale.");
                break;
            }
            this.buttons[i].node = this.buttons[i].button.node;
            this.buttons[i].node.__tag = i;
            let count = this.buttons[i].button.clickEvents.length;
            let event_handler = new cc.Component.EventHandler();
            event_handler.component = "button_group";
            event_handler.handler = "on_click_button";
            event_handler.target = this.node;
            this.buttons[i].button.clickEvents[count] = event_handler;

            if (!this.buttons[i].sprite) {
                this.buttons[i].sprite = this.buttons[i].node.getComponent(cc.Sprite);
            }

            if (i === this.default_index) {
                this.buttons[i].sprite.spriteFrame = this.buttons[i].pressed_sprite_frame;
                if (this.buttons[i].label) {
                    this.buttons[i].label.node.color = this.pressed_text_color;
                }
            }else {
                this.buttons[i].sprite.spriteFrame = this.buttons[i].normal_sprite_frame;
                if (this.buttons[i].label) {
                    this.buttons[i].label.node.color = this.normal_text_color;
                }
            }
        }
    },

    on_click_button: function (event) {
        for (let i = 0; i < this.buttons.length; i ++) {
            if(event.target.__tag === i) {
                this.buttons[i].sprite.spriteFrame = this.buttons[i].pressed_sprite_frame;
                if (this.buttons[i].label) {
                    this.buttons[i].label.node.color = this.pressed_text_color;
                }
            }else{
                this.buttons[i].sprite.spriteFrame = this.buttons[i].normal_sprite_frame;
                if (this.buttons[i].label) {
                    this.buttons[i].label.node.color = this.normal_text_color;
                }
            }
        }
    },

    set_default_index:function (index) {
        this.default_index = index;
    },

    reset: function () {
        this.scheduleOnce(()=> {
            for (let i = 0; i < this.buttons.length; i++) {
                if (this.default_index === i) {
                    this.buttons[i].sprite.spriteFrame = this.buttons[i].pressed_sprite_frame;
                    if (this.buttons[i].label) {
                        this.buttons[i].label.node.color = this.pressed_text_color;
                    }
                }else {
                    this.buttons[i].sprite.spriteFrame = this.buttons[i].normal_sprite_frame;
                    if (this.buttons[i].label) {
                        this.buttons[i].label.node.color = this.normal_text_color;
                    }
                }
            }
        });
    },

    set_to_index: function (index) {
        this.scheduleOnce(()=>{
            for (let i = 0; i < this.buttons.length; i++) {
                if (index === i) {
                    this.buttons[i].sprite.spriteFrame = this.buttons[i].pressed_sprite_frame;
                    if (this.buttons[i].label) {
                        this.buttons[i].label.node.color = this.pressed_text_color;
                    }
                }else {
                    this.buttons[i].sprite.spriteFrame = this.buttons[i].normal_sprite_frame;
                    if (this.buttons[i].label) {
                        this.buttons[i].label.node.color = this.normal_text_color;
                    }
                }
            }
        });
    },

    set_to_name: function (name) {
        this.scheduleOnce(()=>{
            let index = -1;
            for (let i = 0; i < this.buttons.length; i ++) {
                if (name === this.buttons[i].name ) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                return;
            }
            for (let i = 0; i < this.buttons.length; i++) {
                if (index === i) {
                    this.buttons[i].sprite.spriteFrame = this.buttons[i].pressed_sprite_frame;
                    if (this.buttons[i].label) {
                        this.buttons[i].label.node.color = this.pressed_text_color;
                    }
                }else {
                    this.buttons[i].sprite.spriteFrame = this.buttons[i].normal_sprite_frame;
                    if (this.buttons[i].label) {
                        this.buttons[i].label.node.color = this.normal_text_color;
                    }
                }
            }
        });
    }
});
