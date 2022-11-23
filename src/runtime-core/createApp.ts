import { createVNode } from './vnode'

export function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                //先vnode
                const vnode = createVNode(rootComponent)

                render(vnode, rootContainer)
            }
        }
    }
}

