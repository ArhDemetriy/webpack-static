import { SettingsPartitionerImportNames, ImportNamesCollection, NamesList } from '../types'
import { PartitionerImportNames } from '../PartitionerImportNames'
import { PartitionerImportNamesTestDate } from '../__mock__/PartitionerImportNames.test.date'

describe('PartitionerImportNames class:', () => {
  let separater: PartitionerImportNames
  let dataForPartitioner = new PartitionerImportNamesTestDate()
  let separaterSettings: SettingsPartitionerImportNames = {
    importsFilePath: `test/${dataForPartitioner.importsFileName}`,
    sources: dataForPartitioner.sources,
  }
  beforeAll(() => {
    separater = new PartitionerImportNames(separaterSettings);
    (function (this: typeof separater) {
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
    }).call(separater)
  })
  it('shouldt toBe implements PartitionerImportNames', () => {
    expect(separater).toBeDefined()
    expect(separater).toHaveProperty('getSeparateNames')
    expect(typeof separater.getSeparateNames).toBe('function')
  })

  describe('getSeparateNames method:', () => {
    it('shouldt return map', () => {
      const separateNames = separater.getSeparateNames()
      expect(typeof separateNames).toBe('object')
      expect(separateNames).toHaveProperty('size')
      expect(separateNames).toHaveProperty('get')
      expect(separateNames).toHaveProperty('set')
      expect(separateNames).toHaveProperty('has')
    })
    it('shouldt return not empty map', () => {
      expect(separater.getSeparateNames().size).toBeGreaterThanOrEqual(0)
    })
    it('shouldt return map consist value:Set<string>', () => {
      const valuesOfSeparateNames = [...separater.getSeparateNames().values()]
      expect(valuesOfSeparateNames.length).toBeGreaterThanOrEqual(0)
      // expect(typeof valuesOfSeparateNames).toBe('object')
      // expect(valuesOfSeparateNames).toHaveProperty('size')
      // expect(valuesOfSeparateNames).toHaveProperty('get')
      // expect(valuesOfSeparateNames).toHaveProperty('set')
      // expect(valuesOfSeparateNames).toHaveProperty('has')
    })









  })


})





