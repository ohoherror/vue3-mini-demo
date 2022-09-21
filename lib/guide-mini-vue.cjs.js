'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlags: getShapeFlags(type),
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

var isObject = function (val) {
    return val !== null && typeof val === "object";
};
var hasOwn = function (target, key) {
    return target.hasOwnProperty(key);
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (instance, key) {
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

var targetMap = new Map();
//收集依赖 放置在targetMap里面
function track(target, key) {
    targetMap.get(target);
    return;
}
//触发依赖
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    console.log(dep);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            //执行函数，会再次通过get获取值收集依赖
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, isShallowReadonly) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (isShallowReadonly === void 0) { isShallowReadonly = false; }
    return function get(target, key) {
        console.log(target);
        console.log(key);
        var res = Reflect.get(target, key);
        //TODO 依赖收集
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        if (isObject(res) && !isShallowReadonly) {
            return isReadonly ? readonly(target[key]) : reactive(target[key]);
        }
        if (!isReadonly) {
            track(target);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        //触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key) {
        console.warn("key :\"".concat(String(key), "\" set \u5931\u8D25\uFF0C\u56E0\u4E3A target \u662F readonly \u7C7B\u578B"), target);
        return true;
    }
};
var shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: function (target, key) {
        console.warn("key :\"".concat(String(key), "\" set \u5931\u8D25\uFF0C\u56E0\u4E3A target \u662F shallowReadonly \u7C7B\u578B"), target);
        return true;
    }
};

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function createReactiveObject(target, baseHandles) {
    return new Proxy(target, baseHandles);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}

function emit(instance, event) {
    var params = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        params[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    // 在这里进行正则匹配，将 横杠和第一个字母 -> 不要横杠，第一个字母大写
    var camelize = function (str) {
        return str.replace(/-(\w)/, function (_, str) {
            return str.toUpperCase();
        });
    };
    var capitalize = function (str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    };
    // 在这里先处理横杠，在处理大小写
    var handler = props["on".concat(capitalize(camelize(event)))];
    handler && handler.apply(void 0, params);
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        props: null,
        emit: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance, container) {
    initProps(instance, instance.vnode.props);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
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
    var component = instance.type;
    if (!instance.render) {
        instance.render = component.render;
    }
}

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
    if (isObject(props)) {
        for (var prop in props) {
            if (isOn(prop)) {
                var event_1 = prop.slice(2).toLowerCase();
                el.addEventListener(event_1, props[prop]);
            }
            else {
                el.setAttribute(prop, props[prop]);
            }
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
var isOn = function (key) { return /^on[A-Z]/.test(key); };
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

exports.createApp = createApp;
exports.h = h;
