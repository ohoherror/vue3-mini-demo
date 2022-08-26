import { reactive, isReadonly, isReactive } from '../reactive'

describe('reactive', () => {
    it("happy path", () => {
        const original = { foo: 1, bar: { value: 2 } };
        expect(isReactive(original)).toBe(false)
        const observed = reactive(original)
        console.log(observed)
        console.log(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
    })
})