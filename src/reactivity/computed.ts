
import { ReactiveEffect } from "./effect"
export class ComputedRefImpl {

    private _getter
    private ditry = false
    private _value: any
    private _effct
    constructor(getter) {
        this._getter = getter
        this._effct = new ReactiveEffect(getter, () => {
            if (this.ditry) {
                this.ditry = false
            }
        })
    }

    get value() {
        if (!this.ditry) {
            this._value = this._effct.run()
            this.ditry = true
        }
        return this._value
    }
}

export function computed(getter) {
    return new ComputedRefImpl(getter)
}   