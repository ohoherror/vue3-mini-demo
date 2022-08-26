import { mutableHandlers, readonlyHandlers } from "./baseHandler"

export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers)
}

function createReactiveObject(target, baseHandles) {
    return new Proxy(target, baseHandles);
}

export function isReactive(raw) {
    console.log(raw)
    return !!raw[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(raw) {
    console.log(raw)
    return !!raw[ReactiveFlags.IS_READONLY]
}