type newCall<T> = { new(...args: any[]): T }

type MethodImplementation<T> = (this: T, ...args: any[]) => any
type Implementations<T> = { [methodName in ('constructor' | keyof T)]?: (this: T, ...args: any[]) => any }
type PureImplementations<T> = { [methodName in keyof T]?: (this: T, ...args: any[]) => any }
type MockedPrototype<T> = { prototype: { [methodName in keyof T]: jest.Mock } }

function assignImplementations<T>(originalPrototype: {[ K in keyof T]: MethodImplementation<T>}, implementations: PureImplementations<T>) {
  const resultImplementations: PureImplementations<T> = {}
  for (const methodName in originalPrototype) {
    if (typeof originalPrototype[methodName] != 'function') {
      continue
    }
    resultImplementations[methodName] = implementations[methodName] || originalPrototype[methodName]
  }
  return resultImplementations
}

function mockConstructor<T>(mockedClass: jest.Mock<T>, implementations: MethodImplementation<T>) {
  mockedClass.mockImplementation(implementations)
}

function mockMethods<T>(mockedClass: MockedPrototype<T>, implementations: PureImplementations<T>) {
  for (const methodName in mockedClass.prototype) {
    if (typeof mockedClass.prototype[methodName] != 'function') {
      continue
    }
    if (!implementations[methodName]) {
      continue
    }
    mockedClass.prototype[methodName].mockImplementation(implementations[methodName])
  }
}

/**
 * @param {class} mockedClass class how you mocked
 * @param {Map<keyof T, (this: T, ...args: any[]) => any>} implementations map of implementations mocked methods in mocked class. If you need.
 * @example
 * import { Foo } from "./foo";
 * jest.mock("./foo.ts");
 * mockedClass(Foo, new Map([
 *  ['bar', function(this:Foo){ console.log('Foo.bar is mocked'); }],
 * ]))
 * const foo = new Foo()
 * console.log(foo.bar()) // Foo.bar is mocked
 */
function mockedClass<T>(
  mockedClass: newCall<T>,
  originalClass: newCall<T>,
  implementations: { [methodName in ('constructor' | keyof T)]?: MethodImplementation<T> } = {})
{
  const q = mockedClass as unknown as { prototype: { [methodName in keyof T]: jest.Mock } }
  mockConstructor(mockedClass as jest.Mock<T>, (implementations.constructor || originalClass) as MethodImplementation<T>)
  mockMethods(mockedClass as MockedPrototype<T>, assignImplementations<T>(originalClass.prototype, implementations))
}
export {
  mockedClass,
  Implementations,
}
