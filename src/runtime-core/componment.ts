import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initProps } from './componentProps'
import { shallowReadonly } from '../reactivity/reactive'

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        props: null
    }
    return component
}

export function setupComponent(instance, container) {

    initProps(instance, instance.vnode.props)
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props))
        handleSetupResult(instance, setupResult)
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




