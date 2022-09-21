import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
    setup(props, { emit }) {
        // { emit }
        // console.log(props)
        const handleClick = () => {
            // console.log('handleClick')
            emit('add')
            // props.onAdd()
        }
        return {
            handleClick
        }
    },
    // onClick: this.handleClick
    render() {
        return h('button', { onClick: this.handleClick }, '点击我 ')
    }
}