
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
    get(instance, key) {
        const { setupState, props } = instance
        if (key in setupState) {
            return setupState[key]
        } else if (key in props) {
            return props[key]
        }

        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}