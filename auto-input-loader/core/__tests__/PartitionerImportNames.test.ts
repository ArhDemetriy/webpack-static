import { SettingsPartitionerImportNames, ImportNamesCollection, NamesList } from '../types'
import { PartitionerImportNames } from '../__mock__/PartitionerImportNames'
import { PartitionerImportNamesTestDate } from '../__mock__/PartitionerImportNames.test.date'
describe('PartitionerImportNames class:', () => {
  let partitioner: PartitionerImportNames
  let dataForPartitioner : PartitionerImportNamesTestDate
  let partitionerSettings: SettingsPartitionerImportNames;
  beforeAll(() => {
    jest.clearAllMocks()
    dataForPartitioner = new PartitionerImportNamesTestDate()
    partitionerSettings = PartitionerImportNamesTestDate.partitionerSettings()
  })
  beforeEach(() => {
    partitioner = new PartitionerImportNames(partitionerSettings)
  })
  afterEach(function (this: typeof partitioner) {
    jest.clearAllMocks()
  })
})

describe('PartitionerImportNames class it ones created:', () => {
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





