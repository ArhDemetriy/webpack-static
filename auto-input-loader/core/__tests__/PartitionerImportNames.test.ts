import { SettingsPartitionerImportNames, ImportNamesCollection, NamesList } from '../types'
import { PartitionerImportNames } from '../__mock__/PartitionerImportNames'
import { PartitionerImportNamesTestDate } from '../__mock__/PartitionerImportNames.test.date'
describe.only('PartitionerImportNames class:', () => {
  let dataForPartitioner = new PartitionerImportNamesTestDate()
  let partitionerSettings = PartitionerImportNamesTestDate.partitionerSettings()
  let partitioner = new PartitionerImportNames(partitionerSettings)

  describe('check mock implementations:', function(){
    describe('getImportsFrom method:', function (this: typeof partitioner) {
      it.each([...dataForPartitioner.requireMock.entries()])
        ('shouldt return string[] for correct path', (importsPath, requireMock) => {
        expect(partitioner.getImportsFrom(importsPath)).toEqual(requireMock)
      })
      it('shouldt trow for incorrect path', () => {
        expect(()=>partitioner.getImportsFrom('asdafgsg')).toThrow('MOCK file not founded')
      })
    })
    describe('checkExistsPromise method:', function (this: typeof partitioner) {
      it.each([...dataForPartitioner.fsMock.values()])
        ('shouldt resolves for correct path', (importsPath) => {
          return expect(partitioner.checkExistsPromise(importsPath)).resolves.toBeUndefined()
        })
      it('shouldt rejectes for incorrect path', () => {
        return expect(partitioner.checkExistsPromise('asdwq')).rejects.toBeUndefined()
      })
    })
    const q = ((sources) => { })(partitionerSettings.sources,);

    describe.each(partitionerSettings.sources)('from:\n%s', (source) => {
      describe.each([...dataForPartitioner.requireMock.values()])
        ('partitionBlocksFromPath method:', function (this: typeof partitioner, ...requires) {
          const requiresSet = new Set(requires)
          it.skip('shouldt not return Promise.reject', () => {
            // return expect(partitioner.partitionBlocksFromPath(source, requires)).resolves
          })
          it('shouldt return Promise.resolve<{exists, notExists: string[]}>', () => {
            return expect(partitioner.partitionBlocksFromPath(source, requiresSet)).resolves.toBeDefined()
          })
        })
    })
  })
})

describe('PartitionerImportNames class it ones created:', () => {
  expect(123).toBe(123)
  let partitioner: PartitionerImportNames
  let dataForPartitioner = new PartitionerImportNamesTestDate()
  let partitionerSettings = PartitionerImportNamesTestDate.partitionerSettings();
  beforeAll(() => {
    jest.clearAllMocks()
    partitioner = new PartitionerImportNames(partitionerSettings);
  })
  it('shouldt toBe implements PartitionerImportNames', () => {
    expect(partitioner).toBeDefined()
    expect(partitioner).toHaveProperty('getPartitionedNames')
    expect(typeof partitioner.getPartitionedNames).toBe('function')
  })
  describe('getPartitionedNames method:', () => {
    it('shouldt return map', () => {
      const partitionedNames = partitioner.getPartitionedNames()
      expect(typeof partitionedNames).toBe('object')
      expect(partitionedNames).toHaveProperty('get')
      expect(partitionedNames).toHaveProperty('set')
      expect(partitionedNames).toHaveProperty('size')
      expect(partitionedNames).toHaveProperty('has')
    })
    it('shouldt return not empty map', () => {
      expect(partitioner.getPartitionedNames().size).toBeGreaterThanOrEqual(1)
    })
    it('shouldt return map consist value:Set', () => {
      const valuesOfPartitionedNames = [...partitioner.getPartitionedNames().values()]
      expect(valuesOfPartitionedNames.length).toBeGreaterThanOrEqual(1)
      expect(typeof valuesOfPartitionedNames[0]).toBe('object')
      expect(valuesOfPartitionedNames[0]).toHaveProperty('add')
      expect(valuesOfPartitionedNames[0]).toHaveProperty('size')
      expect(valuesOfPartitionedNames[0]).toHaveProperty('has')
    })
  })
  describe('fierstStep method:', function (this: typeof partitioner) {
    const fS = () => partitioner.fierstStep
    it('shouldt called and returned onse', () => {
      expect(fS()).toBeCalled()
      expect(fS()).toBeCalledTimes(1)
      expect(fS()).toReturnTimes(1)
    })
    it('shouldt return string[] from initial imports file', () => {
      expect(fS()).nthCalledWith(1, partitionerSettings.importsFilePath)
      const initialImports = dataForPartitioner.requireMock.get(partitionerSettings.importsFilePath)
      expect(fS()).nthReturnedWith(1, expect.arrayContaining(initialImports))
    })
    it('shouldt call getImportsFrom with self input', () => {
      expect(partitioner.getImportsFrom).toBeCalled()
      expect(partitioner.getImportsFrom).toBeCalledWith(partitionerSettings.importsFilePath)
    })
  })
  describe('getImportsFrom method:', function (this: typeof partitioner) {
    const gif = () => partitioner.getImportsFrom
    it('shouldt be called and returned after create class ', () => {
      expect(gif()).toBeCalled()
      expect(gif()).toReturn()
    })
  })
})





