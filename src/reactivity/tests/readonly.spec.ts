import { readonly, reactive, isReadonly, isReactive, isProxy } from "../reactive";

describe("readonly", () => {
    it("should make nested values readonly", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        // expect(isReactive(original)).toBe(true)
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        wrapped.bar.baz = 3
        expect(wrapped.bar.baz).toBe(2)
        expect(isProxy(wrapped)).toBe(true)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(wrapped.bar)).toBe(true);
    });

    it("should call console.warn when set", () => {
        console.warn = jest.fn();
        const obj = { age: 10, }
        const user = readonly(obj);
        user.age = 11;
        expect(console.warn).toHaveBeenCalled();
    });
});