import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js'

const Provider = {
    name: "App",
    render() {
        return h("div", {}, [h("div", {}, "Provider"), h(Provider2)])
    },
    setup() {
        provide("foo", "fooVal")
        provide("bar", "barVal")
    }
}

const Provider2 = {
    render() {
        return h("div", {}, [h("div", {}, `Provider2 foo:${this.foo}`), h(Consumer)])
    },
    setup() {
        provide('foo', 'foo2')
        const foo = inject("foo");
        return foo
    },
}

const Consumer = {
    setup() {
        const foo = inject("foo")
        const bar = inject("bar")

        return {
            foo,
            bar,
        }
    },
    render() {
        return h("div", {}, `Consumer:-${this.foo}-${this.bar}`)
    }

};

export const App = Provider