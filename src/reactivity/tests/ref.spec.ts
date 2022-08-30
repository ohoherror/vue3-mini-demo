import { ref, isRef, unRef } from '../ref'
import { effect } from '../effect'
import { reactive } from '../reactive'


describe("ref", () => {
    it("happy path", () => {
        const a = ref(1)
        expect(a.value).toBe(1)
    })

    it("should be reactive", () => {
        const a = ref(1);
        const arr = ref([])
        const objVal = ref({ name: 'xc' })
        let dummy;
        let myArr = []
        let dummyObj
        let calls = 0;
        effect(() => {
            calls++;
            dummy = a.value;
            myArr = arr.value
            dummyObj = objVal.value
        });
        arr.value = ['reee']
        expect(dummyObj.name).toBe('xc')
        objVal.value = { name: 'ss' }
        expect(dummyObj.name).toBe('ss')
        expect(myArr[0]).toBe('reee')
        expect(calls).toBe(3);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(4);
        expect(dummy).toBe(2);
        // same value should not trigger
        a.value = 3;
        expect(calls).toBe(5);
        expect(dummy).toBe(3);
    });

    it("should make nested properties reactive", () => {
        const a = ref({
            count: 1,
        });
        let dummy;
        effect(() => {
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    });

    it("isRef", () => {
        const a = ref(1);
        const user = reactive({
            age: 1,
        });
        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(user)).toBe(false);
    });

    it("unRef", () => {
        const a = ref(1)
        expect(unRef(a)).toBe(1)
        expect(unRef(1)).toBe(1)
    })
})