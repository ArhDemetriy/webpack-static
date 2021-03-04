import { SettingsSeparaterImportNames, ImportNamesCollection, NamesList } from '../types'
import { SeparaterImportNames } from '../SeparaterImportNames'
import { SeparaterImportNamesTestDate } from '../__mock__/SeparaterImportNames.test.date'

describe('SeparaterImportNames class:', () => {
  let separater: SeparaterImportNames
  let dataForSeparater = new SeparaterImportNamesTestDate()
  let separaterSettings: SettingsSeparaterImportNames = {
    importsFilePath: `test/${dataForSeparater.importsFileName}`,
    sources: dataForSeparater.sources,
  }
  beforeAll(() => {
    separater = new SeparaterImportNames(separaterSettings);
    (function (this: typeof separater) {
      this.getImportsFrom = jest.fn(this.getImportsFrom)
        .mockImplementation(function (s: string) {
          if (!dataForSeparater.requireMock.has(s))
            throw new Error('MOCK file not founded');
          return dataForSeparater.requireMock.get(s)
        })
      this.checkExistsPromise = jest.fn(this.checkExistsPromise)
        .mockImplementation(function (s: string) {
          if (dataForSeparater.fsMock.has(s))
            return Promise.resolve()
          else
            return Promise.reject()
        })
    }).call(separater)
  })
  it('shouldt toBe implements SeparaterImportNames', () => {
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





