import { createComponentInstance, setupComponent } from './componment'
import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/shapeFlags'
import { Fragment, Text } from './vnode'

export function render(vnode, container) {
    patch(vnode, container, null)
}

export function patch(vnode, container, parentComponent) {
    const { type, shapeFlags } = vnode

    switch (type) {
        case Fragment:
            processFragment(vnode, container, parentComponent);
            break;
        case Text:
            processText(vnode, container)
            break;

        default:
            if (shapeFlags & ShapeFlags.ELEMENT) {
                processElement(vnode, container, parentComponent)
            } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container, parentComponent)
            }
            break;
    }
}

function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent)
}

function processText(vnode, container) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.appendChild(textNode)
}

function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent)
}

function mountElement(vnode, container, parentComponent) {
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
        mountChildren(vnode, el, parentComponent)
    }
    container.appendChild(el)
}

const isOn = (key: string) => /^on[A-Z]/.test(key)

function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(vnode => {
        patch(vnode, container, parentComponent)
    })
}

function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
}

function mountComponent(initialVNode, container, parentComponent) {
    let instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
}

export function setupRenderEffect(instance, initialVNode, container) {
    // const { setupState } = instance
    const subTree = instance.render.call(instance.proxy)
    patch(subTree, container, instance)
    console.log(subTree)
    initialVNode.el = subTree.el;
}