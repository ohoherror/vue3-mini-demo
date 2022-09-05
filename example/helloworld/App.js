import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    // 必须要写 render
    render() {
        // ui
        return h("div", "hi, " + this.msg);
        // return h("div", { 'style': "color:#00f" }, 'rueueuurur')
    },

    setup() {
        return {
            msg: "mini-vue",
        };
    },
};