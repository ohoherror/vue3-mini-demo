import { trackEffects, triggerEffects, isTracking } from "./effect"
import { hasChanged } from '../shared'
export class RefImpl {
    public _rawValue
    public dep
    private _value
    constructor(value) {
        this._rawValue = value
        this._value = value
        this.dep = new Set()
    }
    get value() {
        trackRefValue(this)
        return this._rawValue
    }
    set value(newValue) {
        console.log(newValue)
        if (!hasChanged(newValue, this._value)) return
        this._rawValue = newValue
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