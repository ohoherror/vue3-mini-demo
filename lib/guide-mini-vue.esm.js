function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode
    };
    return component;
}
function setupComponent(instance, container) {
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance, container) {
    var Component = instance.vnode.type;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var component = instance.vnode.type;
    if (!instance.render) {
        instance.render = component.render;
    }
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree, container);
}

var isObject = function (val) {
    return val !== null && typeof val === "object";
};

function render(vnode, container) {
    patch(vnode, container);
}

function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }

}

function processElement(vnode, container) {
    mountElement(vnode, container);
}

function mountElement(vnode, container) {
    const { type: domElType, props, children } = vnode;
    const domEl = document.createElement(domElType);
    if (isObject(props)) {
        for (const prop in props) {
            domEl.setAttribute(prop, props[prop]);
        }
    }


    if (typeof children === 'string') {
        domEl.textContent = children;
    } else if (Array.isArray(children)) {
        mountChildren(vnode, domEl);
    }

    container.appendChild(domEl);
}

function mountChildren(vnode, container) {
    vnode.children.forEach(vnode => {
        patch(vnode, container);
    });
}

function processComponent(vnode, container) {
    mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
    let instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            //先vnode
            var vnode = createVNode(rootComponent);
            render(vnode, document.querySelector(rootContainer));
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
