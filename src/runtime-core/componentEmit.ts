export function emit(instance, event) {
    let { props } = instance
    const toUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
    const handler = props[`on${toUpperCase(event)}`]
    handler && handler()
}