function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlags: getShapeFlags(type)
    };
    if (typeof children === 'string') {
        vnode.shapeFlags |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (instance, key) {
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        el: null
    };
    return component;
}
function setupComponent(instance, container) {
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance, container) {
    var Component = instance.type;
    var setup = Component.setup;
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
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

var isObject = function (val) {
    return val !== null && typeof val === "object";
};

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    var shapeFlags = vnode.shapeFlags;
    if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    vnode.type; var props = vnode.props, children = vnode.children, shapeFlags = vnode.shapeFlags;
    // const domEl = document.createElement(domElType)
    if (isObject(props)) {
        for (var prop in props) {
            el.setAttribute(prop, props[prop]);
        }
    }
    if (shapeFlags & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (vnode) {
        patch(vnode, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    // const { setupState } = instance
    var subTree = instance.render.call(instance.proxy);
    patch(subTree, container);
    console.log(subTree);
    initialVNode.el = subTree.el;
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
