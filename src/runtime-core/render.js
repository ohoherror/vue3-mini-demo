import { createComponentInstance, setupComponent } from './componment'
import { isObject } from '../shared'

export function render(vnode, container) {
    patch(vnode, container)
}

export function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type))

    const { type: domElType, props, children } = vnode
    // const domEl = document.createElement(domElType)
    if (isObject(props)) {
        for (const prop in props) {
            el.setAttribute(prop, props[prop])
        }
    }


    if (typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
        mountChildren(vnode, el)
    }

    container.appendChild(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(vnode => {
        patch(vnode, container)
    })
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function mountComponent(initialVNode, container) {
    let instance = createComponentInstance(initialVNode)
    setupComponent(instance, container)
    setupRenderEffect(instance, initialVNode, container)
}

export function setupRenderEffect(instance, initialVNode, container) {
    // const { setupState } = instance
    const subTree = instance.render.call(instance.proxy)
    patch(subTree, container)
    console.log(subTree)
    initialVNode.el = subTree.el;
}