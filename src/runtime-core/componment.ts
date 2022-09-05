import { patch } from './render'
export function createComponentInstance(vnode) {
    const component = {
        vnode
    }
    return component
}

export function setupComponent(instance, container) {
    setupStatefulComponent(instance, container)
}

function setupStatefulComponent(instance, container) {

    const Component = instance.vnode.type;
    const { setup } = Component
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

export function setupRenderEffect(instance, container) {
    const subTree = instance.render()
    patch(subTree, container)
}


