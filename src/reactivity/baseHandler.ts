
import { track, trigger } from "./effect"
import { ReactiveFlags, reactive, readonly } from './reactive'
import { isObject } from '../shared/index'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallowReadonly = false) {
    return function get(target, key) {
        console.log(target)
        console.log(key)
        const res = Reflect.get(target, key)
        //TODO 依赖收集
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        if (isObject(res) && !isShallowReadonly) {
            return isReadonly ? readonly(target[key]) : reactive(target[key])
        }

        if (!isReadonly) {
            track(target, key)
        }

        return res
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        //触发依赖
        trigger(target, key)
        return res
    }
}

export const mutableHandlers = {
    get,
    set,
};

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        console.warn(
            `key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
            target
        );

        return true;
    }
}


export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set(target, key) {
        console.warn(
            `key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
            target
        );

        return true;
    }
}
