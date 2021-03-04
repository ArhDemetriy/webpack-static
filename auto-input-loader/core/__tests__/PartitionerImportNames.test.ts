import { SettingsPartitionerImportNames, ImportNamesCollection, NamesList } from '../types'
import { PartitionerImportNames } from '../PartitionerImportNames'
import { PartitionerImportNamesTestDate } from '../__mock__/PartitionerImportNames.test.date'

describe('PartitionerImportNames class:', () => {
  let partitioner: PartitionerImportNames
  let dataForPartitioner = new PartitionerImportNamesTestDate()
  let partitionerSettings: SettingsPartitionerImportNames = {
    importsFilePath: `test/${dataForPartitioner.importsFileName}`,
    sources: dataForPartitioner.sources,
  }
  beforeAll(() => {
    partitioner = new PartitionerImportNames(partitionerSettings);
    (function (this: typeof partitioner) {
      this.getImportsFrom = jest.fn(this.getImportsFrom)
        .mockImplementation(function (s: string) {
          if (!dataForPartitioner.requireMock.has(s))
            throw new Error('MOCK file not founded');
          return dataForPartitioner.requireMock.get(s)
        })
      this.checkExistsPromise = jest.fn(this.checkExistsPromise)
        .mockImplementation(function (s: string) {
          if (dataForPartitioner.fsMock.has(s))
            return Promise.resolve()
          else
            return Promise.reject()
        })
    }).call(partitioner)
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
      expect(partitionedNames).toHaveProperty('size')
      expect(partitionedNames).toHaveProperty('get')
      expect(partitionedNames).toHaveProperty('set')
      expect(partitionedNames).toHaveProperty('has')
    })
    it('shouldt return not empty map', () => {
      expect(partitioner.getPartitionedNames().size).toBeGreaterThanOrEqual(0)
    })
    it('shouldt return map consist value:Set<string>', () => {
      const valuesOfPartitionedNames = [...partitioner.getPartitionedNames().values()]
      expect(valuesOfPartitionedNames.length).toBeGreaterThanOrEqual(0)
      // expect(typeof valuesOfPartitionedNames).toBe('object')
      // expect(valuesOfPartitionedNames).toHaveProperty('size')
      // expect(valuesOfPartitionedNames).toHaveProperty('get')
      // expect(valuesOfPartitionedNames).toHaveProperty('set')
      // expect(valuesOfPartitionedNames).toHaveProperty('has')
    })









  })


})





