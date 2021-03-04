import { SettingsParserResolves } from './types'
import { ParserResolves } from './ParserResolves'

describe('ParserResolves class:', () => {
  describe('ParserResolves for empty settings:', () => {
    let namesSeparator: ParserResolves
    const settings: SettingsParserResolves = {
      sources: [],
    }
    beforeAll(() => {
      namesSeparator = new ParserResolves(settings)
    })
    test('shouldt create wisout settings', () => {
      expect(namesSeparator).toBeDefined()
    })
    describe('getSeparatedPaths function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getSeparatedPaths).toBeDefined()
      })
      test('shouldt return Map', () => {
        expect(namesSeparator.getSeparatedPaths()).toHaveProperty('keys')
        expect(namesSeparator.getSeparatedPaths()).toHaveProperty('size')
        expect(namesSeparator.getSeparatedPaths().set).toBeDefined()
        expect(namesSeparator.getSeparatedPaths().get).toBeDefined()
        expect(namesSeparator.getSeparatedPaths().size).toBeDefined()
        expect(namesSeparator.getSeparatedPaths().size).toBeGreaterThanOrEqual(0)
      })
      test('shouldt return empty Map', () => {
        expect(namesSeparator.getSeparatedPaths().size).toBe(0)
      })
    })
    describe('getPathsFrom function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getPathsFrom).toBeDefined()
      })
      test('shouldt return undefined', () => {
        expect(namesSeparator.getPathsFrom('asny')).toBeUndefined()
      })
    })
  })
  describe('ParserResolves wis settings:', () => {
    let namesSeparator: ParserResolves
    const settings: SettingsParserResolves = {
      sources: ['qwe'],
    }
    beforeAll(() => {
      namesSeparator = new ParserResolves(settings)
    })
    describe('getSeparatedPaths function:', () => {
      test('shouldt return Map size 1', () => {
        expect(namesSeparator.getSeparatedPaths().size).toBe(1)
      })
      test('shouldt return Map key = settings.sources', () => {
        expect([...namesSeparator.getSeparatedPaths().keys()]).toEqual(settings.sources)
      })
    })
    describe('getPathsFrom function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getPathsFrom).toBeDefined()
      })
      test('shouldt return undefined for incorrect input', () => {
        expect(namesSeparator.getPathsFrom('asny')).toBeUndefined()
      })
      test('shouldt return set for correct input', () => {
        const names = namesSeparator.getPathsFrom(settings.sources[Math.round(Math.random() * (settings.sources.length - 1))])
        expect(names).toBeDefined()
        expect(names).toHaveProperty(['size'], 0)
      })
    })
  })
})

