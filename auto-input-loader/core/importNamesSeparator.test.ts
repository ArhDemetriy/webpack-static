import {ImportNamesSeparator, SettingsImportNamesSeparator } from './importNamesSeparator'

describe('importNamesSeparator class:', () => {
  test('shouldt toBe', () => {
    expect(ImportNamesSeparator).toBeDefined()
  })
  describe('importNamesSeparator for empty settings:', () => {
    let namesSeparator: ImportNamesSeparator
    const settings: SettingsImportNamesSeparator = {
      sources: [],
    }
    beforeAll(() => {
      namesSeparator = new ImportNamesSeparator(settings)
    })
    test('shouldt create wisout settings', () => {
      expect(namesSeparator).toBeDefined()
    })
    describe('getSeparateImportNames function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getSeparateImportNames).toBeDefined()
      })
      test('shouldt return Map', () => {
        expect(namesSeparator.getSeparateImportNames()).toHaveProperty('keys')
        expect(namesSeparator.getSeparateImportNames()).toHaveProperty('size')
        expect(namesSeparator.getSeparateImportNames().set).toBeDefined()
        expect(namesSeparator.getSeparateImportNames().get).toBeDefined()
        expect(namesSeparator.getSeparateImportNames().size).toBeDefined()
        expect(namesSeparator.getSeparateImportNames().size).toBeGreaterThanOrEqual(0)
      })
      test('shouldt return empty Map', () => {
        expect(namesSeparator.getSeparateImportNames().size).toBe(0)
      })
    })
    describe('getImportsNamesFrom function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getImportsNamesFrom).toBeDefined()
      })
      test('shouldt return undefined', () => {
        expect(namesSeparator.getImportsNamesFrom('asny')).toBeUndefined()
      })
    })
  })
  describe('importNamesSeparator wis settings:', () => {
    let namesSeparator: ImportNamesSeparator
    const settings: SettingsImportNamesSeparator = {
      sources: ['qwe'],
    }
    beforeAll(() => {
      namesSeparator = new ImportNamesSeparator(settings)
    })
    describe('getSeparateImportNames function:', () => {
      test('shouldt return Map size 1', () => {
        expect(namesSeparator.getSeparateImportNames().size).toBe(1)
      })
      test('shouldt return Map key = settings.sources', () => {
        expect([...namesSeparator.getSeparateImportNames().keys()]).toEqual(settings.sources)
      })

    })
    describe('getImportsNamesFrom function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getImportsNamesFrom).toBeDefined()
      })
      test('shouldt return undefined for incorrect input', () => {
        expect(namesSeparator.getImportsNamesFrom('asny')).toBeUndefined()
      })
      test('shouldt return set for correct input', () => {
        const names = namesSeparator.getImportsNamesFrom(settings.sources[Math.round(Math.random() * (settings.sources.length - 1))])
        expect(names).toBeDefined()
        expect(names).toHaveProperty(['size'], 0)
      })
    })
  })
})

