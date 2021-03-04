import { SettingsParserResolves } from '../types'
import { ParserResolves } from '../ParserResolves'

describe('ParserResolves class:', () => {
  describe('ParserResolves for empty settings:', () => {
    let namesPartitioner: ParserResolves
    const settings: SettingsParserResolves = {
      sources: [],
    }
    beforeAll(() => {
      namesPartitioner = new ParserResolves(settings)
    })
    test('shouldt create wisout settings', () => {
      expect(namesPartitioner).toBeDefined()
    })
    describe('getPartitionedPaths function:', () => {
      test('shouldt toBe', () => {
        expect(namesPartitioner.getPartitionedPaths).toBeDefined()
      })
      test('shouldt return Map', () => {
        expect(namesPartitioner.getPartitionedPaths()).toHaveProperty('keys')
        expect(namesPartitioner.getPartitionedPaths()).toHaveProperty('size')
        expect(namesPartitioner.getPartitionedPaths().set).toBeDefined()
        expect(namesPartitioner.getPartitionedPaths().get).toBeDefined()
        expect(namesPartitioner.getPartitionedPaths().size).toBeDefined()
        expect(namesPartitioner.getPartitionedPaths().size).toBeGreaterThanOrEqual(0)
      })
      test('shouldt return empty Map', () => {
        expect(namesPartitioner.getPartitionedPaths().size).toBe(0)
      })
    })
    describe('getPathsFrom function:', () => {
      test('shouldt toBe', () => {
        expect(namesPartitioner.getPathsFrom).toBeDefined()
      })
      test('shouldt return undefined', () => {
        expect(namesPartitioner.getPathsFrom('asny')).toBeUndefined()
      })
    })
  })
  describe('ParserResolves wis settings:', () => {
    let namesPartitioner: ParserResolves
    const settings: SettingsParserResolves = {
      sources: ['qwe'],
    }
    beforeAll(() => {
      namesPartitioner = new ParserResolves(settings)
    })
    describe('getPartitionedPaths function:', () => {
      test('shouldt return Map size 1', () => {
        expect(namesPartitioner.getPartitionedPaths().size).toBe(1)
      })
      test('shouldt return Map key = settings.sources', () => {
        expect([...namesPartitioner.getPartitionedPaths().keys()]).toEqual(settings.sources)
      })
    })
    describe('getPathsFrom function:', () => {
      test('shouldt toBe', () => {
        expect(namesPartitioner.getPathsFrom).toBeDefined()
      })
      test('shouldt return undefined for incorrect input', () => {
        expect(namesPartitioner.getPathsFrom('asny')).toBeUndefined()
      })
      test('shouldt return set for correct input', () => {
        const names = namesPartitioner.getPathsFrom(settings.sources[Math.round(Math.random() * (settings.sources.length - 1))])
        expect(names).toBeDefined()
        expect(names).toHaveProperty(['size'], 0)
      })
    })
  })
})

