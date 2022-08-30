import { trackEffects, triggerEffects, isTracking } from "./effect"
import { hasChanged, isObject } from '../shared'
import { reactive } from "./reactive"
export class RefImpl {
    private _rawValue
    public dep
    private _value
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set()
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
export const ref = (row) => {
    return new RefImpl(row)
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}