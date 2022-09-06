import { trackEffects, triggerEffects, isTracking } from "./effect"
import { hasChanged, isObject, extend } from '../shared/index'
import { reactive } from "./reactive"

export class RefImpl {
    private _rawValue: any
    public dep: any
    public v_is_ref: any
    private _value: any
    constructor(value: any) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set()
        this.v_is_ref = true
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newValue) {
        console.log(newValue)
        if (!hasChanged(newValue, this._value)) return
        this._rawValue = newValue
        this._value = convert(newValue);
        triggerEffects(this.dep)
    }
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
export const ref = (raw) => {
    return new RefImpl(raw)
}

export const isRef = (raw) => {
    return !!raw['v_is_ref']
}

export const unRef = (raw) => {
    return isRef(raw) ? raw.value : raw
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },

        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            } else {
                return Reflect.set(target, key, value);
            }
        },
    })

}