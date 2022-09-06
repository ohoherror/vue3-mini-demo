import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }
    return component
}

export function setupComponent(instance, container) {
    setupStatefulComponent(instance, container)
}

function setupStatefulComponent(instance, container) {
    const Component = instance.type;
    const { setup } = Component
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
    if (setup) {
        const setupResult = setup()
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
    const component = instance.vnode.type
    if (!instance.render) {
        instance.render = component.render
    }
}




