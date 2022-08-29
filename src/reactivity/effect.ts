let activeEffect
let shouldTrack = false
export class ReactiveEffect {
    active = true
    deps = []
    public onStop?: () => void;
    constructor(public fn, public scheduler?) {
        console.log("创建 ReactiveEffect 对象");
    }
    run() {
        if (!this.active) {
            return this.fn()
        }
        shouldTrack = true
        activeEffect = this
        const r = this.fn();
        shouldTrack = false
        return r
    }
    stop() {
        if (this.active) {
            if (this.onStop) {
                this.onStop()
            }

            cleanupEffect(this);
            this.active = false

        }
    }
}

function cleanupEffect(effect) {
    // 找到所有依赖这个 effect 的响应式对象
    // 从这些响应式对象里面把 effect 给删除掉
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });

    effect.deps.length = 0;
}

export function stop(runner) {
    runner.effect.stop()
}

const targetMap = new Map()
//收集依赖 放置在targetMap里面
export function track(target, key) {
    let depsMap = targetMap.get(target)
    if (!isTracking()) return
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    trackEffects(dep)
}

export function trackEffects(dep) {
    console.log(dep)
    if (!isTracking()) return
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        if (activeEffect) {
            (activeEffect as any).deps.push(dep);
        }
    }
}
export function isTracking() {
    return shouldTrack && activeEffect !== undefined
}
//触发依赖
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    console.log(dep)
    triggerEffects(dep)
}

export function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            //执行函数，会再次通过get获取值收集依赖
            effect.run()
        }

    }
}

export const extend = Object.assign;
export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn)
    extend(_effect, options)
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}
