import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
    setup(props) {
        console.log(props)
        props.count++
    },
    render() {
        console.log(this.$el)
        return h('div', {}, 'Hello World ' + this.count)
    }
}