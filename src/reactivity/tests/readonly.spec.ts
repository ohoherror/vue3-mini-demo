import { readonly, reactive, isReadonly, isReactive } from "../reactive";

describe("readonly", () => {
    it("should make nested values readonly", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        // expect(isReactive(original)).toBe(true)
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        wrapped.bar.baz = 3
        expect(isReadonly(wrapped)).toBe(true)
        expect(wrapped.bar.baz).toBe(3);
    });

    it("should call console.warn when set", () => {
        console.warn = jest.fn();
        const user = readonly({
            age: 10,
        });

        user.age = 11;
        expect(console.warn).toHaveBeenCalled();
    });
});