import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
    setup(props) {
        console.log(props)
    },
    render() {
        console.log(this.$el)
        return h('div', {}, 'Hello World ' + this.count)
    }
}