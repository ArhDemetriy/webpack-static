import { SettingsParserResolves } from '../types'
import { ParserResolves } from '../ParserResolves'

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
    describe('getPartitionedPaths function:', () => {
      test('shouldt toBe', () => {
        expect(namesSeparator.getPartitionedPaths).toBeDefined()
      })
      test('shouldt return Map', () => {
        expect(namesSeparator.getPartitionedPaths()).toHaveProperty('keys')
        expect(namesSeparator.getPartitionedPaths()).toHaveProperty('size')
        expect(namesSeparator.getPartitionedPaths().set).toBeDefined()
        expect(namesSeparator.getPartitionedPaths().get).toBeDefined()
        expect(namesSeparator.getPartitionedPaths().size).toBeDefined()
        expect(namesSeparator.getPartitionedPaths().size).toBeGreaterThanOrEqual(0)
      })
      test('shouldt return empty Map', () => {
        expect(namesSeparator.getPartitionedPaths().size).toBe(0)
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
    describe('getPartitionedPaths function:', () => {
      test('shouldt return Map size 1', () => {
        expect(namesSeparator.getPartitionedPaths().size).toBe(1)
      })
      test('shouldt return Map key = settings.sources', () => {
        expect([...namesSeparator.getPartitionedPaths().keys()]).toEqual(settings.sources)
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

