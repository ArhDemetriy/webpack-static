type newCall<T> = { new(...args: any[]): T }
function wisoutMockImplementations<T>(this: newCall<T>, mc: newCall<T>) {
  for (const name in mc.prototype) {
    if (typeof mc.prototype[name] == 'function')
      mc.prototype[name] = jest.fn(mc.prototype[name])
  }
}
type arrayImplementations = [string, (...args: any[]) => any][]
type collectionsOfImplementations<T> = Map<string, (this: T, ...args: any[]) => any>
function wisMockImplementations<T>
  (this: newCall<T>, mc: newCall<T>, implementations: collectionsOfImplementations<T>) {
  for (const name in mc.prototype) {
    if (typeof mc.prototype[name] == 'function') {
      if (implementations.has(name))
        mc.prototype[name] = jest.fn(mc.prototype[name])
          .mockImplementation(implementations.get(name))
      else
        mc.prototype[name] = jest.fn(mc.prototype[name])
    }
  }
}

function mockedClass<T>(mockedClass: newCall<T>, implementations?: collectionsOfImplementations<T>) {
  if (!implementations || implementations.size <= 0)
    wisoutMockImplementations.call(mockedClass, mockedClass)
  else
    wisMockImplementations.call(mockedClass, mockedClass, implementations)
}
export {
  mockedClass,
  arrayImplementations,
  collectionsOfImplementations,
}
