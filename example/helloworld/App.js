import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    // 必须要写 render
    render() {
        // ui
        return h("div", {
            id: "root",
            class: ["red"],
        }, 'hi ' + this.name + ' ' + this.msg);
        // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, 'hi' + this.msg)]
        // return h("div", { 'style': "color:#00f" }, 'rueueuurur')
    },

    setup() {
        return {
            msg: "mini-vue",
            name: 'xc'
        };
    },
};