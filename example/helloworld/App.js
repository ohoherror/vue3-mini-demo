import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from './Foo.js'

window.self = null
export const App = {
    // 必须要写 render
    render() {
        window.self = this
        // ui
        return h("div", {
            class: 'red', // event
            // onClick() {
            //     console.log('click')
            // },
            // onMousedown() {
            //     console.log('mousedown')
            // },
        }, [
            // 挂载一个组件
            h(Foo, { onAdd: this.onAdd, onAddCount: this.onAddCount }),
        ]);
        // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, 'hi' + this.msg)]
        // return h("div", { 'style': "color:#00f" }, 'rueueuurur')
    },

    setup() {
        function onAdd(value) {
            console.log(value)
            console.log('onAdd')
        }
        function onAddCount(y) {
            console.log(3 + y)
            return 3 + y
        }
        return {
            onAdd,
            onAddCount,
            msg: "mini-vue",
            name: 'xc'
        };
    },
};