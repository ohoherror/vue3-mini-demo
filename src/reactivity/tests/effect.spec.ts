import { isReactive, reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
    it("happy path", () => {
        const user = reactive({ age: 10 });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1
        });
        expect(nextAge).toBe(11)

        //update
        user.age++;
        expect(nextAge).toBe(12)
    })

    it('should run the passed function once (wrapped by a effect)', () => {
        const fnSpy = jest.fn(() => { })
        effect(fnSpy)
        expect(fnSpy).toHaveBeenCalledTimes(1)
    })

    it("should observe multiple properties", () => {
        let dummy
        const counter = reactive({ num1: 0, num2: 0 })
        let runner = effect(() => (
            dummy = counter.num1 + counter.num1 + counter.num2
        ))

        expect(dummy).toBe(0)
        stop(runner)
        //set值会执行trigger,执行函数fn,并触发get,数据得到响应
        counter.num1 = counter.num2 = 7
        expect(dummy).toBe(0)
    })

    it("should handle multiple effects", () => {
        let dummy1, dummy2
        const counter = reactive({ num: 0 })
        effect(() => (dummy1 = counter.num))
        effect(() => (dummy2 = counter.num))
        expect(dummy1).toBe(0)
        expect(dummy2).toBe(0)
        counter.num++
        expect(dummy1).toBe(1)
        expect(dummy2).toBe(1)
    })

    it("should observe nested properties", () => {
        let dummy;
        const counter = reactive({ nested: { num: 0 }, arr: [{ name: 'xc' }] })
        effect(() => (dummy = counter.nested.num))
        expect(isReactive(counter)).toBe(true)
        expect(dummy).toBe(0)
        counter.nested.num = 8
        expect(isReactive(counter.nested)).toBe(true)
        expect(isReactive(counter.arr[0])).toBe(true)
        expect(dummy).toBe(8)
    })

    it("should return runner", () => {
        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe('foo')

    })

    it("scheduler", () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        console.log(scheduler)
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        //should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        // // should not run yet
        expect(dummy).toBe(1);
        // // manually run
        run();
        // // should have run
        expect(dummy).toBe(2);
    });

    it("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 })
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.prop++
        expect(obj.prop).toBe(3)
        //obj的值已经改变了，只是没有收集到依赖，不能运行run函数，将obj.prop的值赋给dummy
        expect(dummy).toBe(2)
        //直接运行run函数
        runner()
        expect(dummy).toBe(3)
    })


    it("event:onStop", () => {
        const onStop = jest.fn()
        const runner = effect(() => { }, { onStop })
        stop(runner)
        expect(onStop).toHaveBeenCalled()
    })
})

