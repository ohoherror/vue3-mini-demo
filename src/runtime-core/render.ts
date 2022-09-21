import { createComponentInstance, setupComponent } from './componment'
import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/shapeFlags'

export function render(vnode, container) {
    patch(vnode, container)
}

export function patch(vnode, container) {
    const { shapeFlags } = vnode
    if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
    } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type))
    const { type: domElType, props, children, shapeFlags } = vnode
    if (isObject(props)) {
        for (const prop in props) {
            if (isOn(prop)) {
                const event = prop.slice(2).toLowerCase()
                el.addEventListener(event, props[prop])
            } else {
                el.setAttribute(prop, props[prop])
            }
        }
    }
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    container.appendChild(el)
}

const isOn = (key: string) => /^on[A-Z]/.test(key)

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