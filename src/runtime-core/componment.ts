import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initProps } from './componentProps'
import { initSlots } from './componentSlots'
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        props: null,
        emit: () => { },
        slots: {},
    }
    component.emit = emit.bind(null, component) as any
    return component
}


export function setupComponent(instance, container) {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
    if (setup) {
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
        handleSetupResult(instance, setupResult)
        setCurrentInstance(null)
    }
}

function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const component = instance.type
    if (!instance.render) {
        instance.render = component.render
    }
}
let currentInstance = null;

export function getCurrentInstance() {
    return currentInstance
}

export function setCurrentInstance(instance) {
    currentInstance = instance
}



