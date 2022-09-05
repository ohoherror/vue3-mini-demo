import { createComponentInstance, setupComponent, setupRenderEffect } from './componment'
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
    const { type: domElType, props, children } = vnode
    const domEl = document.createElement(domElType)
    if (isObject(props)) {
        for (const prop in props) {
            domEl.setAttribute(prop, props[prop])
        }
    }


    if (typeof children === 'string') {
        domEl.textContent = children
    } else if (Array.isArray(children)) {
        mountChildren(vnode, domEl)
    }

    container.appendChild(domEl)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(vnode => {
        patch(vnode, container)
    })
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
    let instance = createComponentInstance(vnode)
    setupComponent(instance, container)
    setupRenderEffect(instance, container)
}

