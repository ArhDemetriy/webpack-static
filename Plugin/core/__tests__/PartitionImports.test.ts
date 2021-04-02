import { SettingsPartitionImports, ImportNamesCollection, NamesList } from '../types'
import { PartitionImports } from '../__mock__/PartitionImports'
import { PartitionImportsTestDate } from '../__mock__/PartitionImports.test.date'
import path = require('path')
describe('PartitionImports class:', () => {
  let dataForPartitioner = new PartitionImportsTestDate()
  let partitionerSettings = PartitionImportsTestDate.partitionerSettings()
  let partitioner = new PartitionImports(partitionerSettings);

  describe('getImportsFrom method:', function (this: typeof partitioner) {
    it.each([...dataForPartitioner.requireMock.entries()])
      ('shouldt return string[] for correct path: %s', (importsPath, requireMock) => {
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
  describe('partitionBlocksFromPath method:', () => {
    describe.each(partitionerSettings.sources)('from: %s', (source) => {
      describe.each([...dataForPartitioner.requireMock.values()])
        ('is requires:', function (this: typeof partitioner, ...requires) {
          const requiresSet = new Set(requires)
          it('shouldt return Promise.resolve<{exists, notExists: string[]}>', async () => {
            await expect(partitioner.partitionBlocksFromPath(source, requiresSet)).resolves.toBeDefined()
            const resolve = await partitioner.partitionBlocksFromPath(source, requiresSet)
            expect(resolve).toMatchObject({exists: expect.any(Array), notExists: expect.any(Array)})
          })
          describe(`result = await partitionBlocksFromPath(source, requiresSet)`, () => {
            beforeEach(() => {
              jest.clearAllMocks()
            })
            it('result.exists concat result.notExists <=> inputSet', async () => {
              const result = await partitioner.partitionBlocksFromPath(source, requiresSet)
              expect(result.exists.length + result.notExists.length).toBe(requiresSet.size)
              const concatedPartitionBlocks = [].concat(result.exists, result.notExists)
              expect(concatedPartitionBlocks).toEqual(expect.arrayContaining(Array.from(requiresSet)))
              expect(Array.from(requiresSet)).toEqual(expect.arrayContaining(concatedPartitionBlocks))
            })
            it('result.exists shouldt be includes to source', async() => {
              const result = await partitioner.partitionBlocksFromPath(source, requiresSet)
              const directoryContents = [...dataForPartitioner.fileSistemShot.get(source)]
              expect(directoryContents).toEqual(expect.arrayContaining(result.exists))
            })
            it('result.notExists shouldt be not includes to source', async() => {
              const result = await partitioner.partitionBlocksFromPath(source, requiresSet)
              if (result.notExists.length <= 0)
                expect(result.notExists).toHaveLength(0)
              else {
                const directoryContents = [...dataForPartitioner.fileSistemShot.get(source)]
                expect(directoryContents).not.toEqual(expect.arrayContaining(result.notExists))}
            })
          })
          describe('call checkExistsPromise for every require:', () => {
            beforeEach(() => {
              jest.clearAllMocks()
            })
            it('CalledTimes == requiresSet.size', async() => {
              await partitioner.partitionBlocksFromPath(source, requiresSet)
              expect(partitioner.checkExistsPromise).toBeCalledTimes(requiresSet.size)
            })
            it('CalledWith == requiresSet', async () => {
              await partitioner.partitionBlocksFromPath(source, new Set(requires))
              for (const req of requires.map(req => path.resolve(source, req))) {
                expect(partitioner.checkExistsPromise).toBeCalledWith(req, expect.any(Number))
              }
            })
          })
        })
    })
  })
  describe('getAdditionalImports method:', function (this: typeof partitioner) {
    it('shouldt toBe', () => {
      expect(partitioner.getAdditionalImports).toBeDefined()
    })
    it('shouldt resolves === [] for empty checkableBlocks (2 attr)', () => {
      return expect(partitioner.getAdditionalImports('kkdtfh', [])).resolves.toEqual([])
    })
    describe.each([...dataForPartitioner.requireMock.keys()])('imports from: %s', importsPath => {
      const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
      describe.each(partitionerSettings.sources)('testings in: %s\n', source => {
        describe('test exists results:', () => {
          if (source.includes('simple')) {
            it('shouldt resolves === [] if not additional imports', () => {
              return expect(partitioner.getAdditionalImports(source, checkableBlocks)).resolves.toEqual([])
            })
          } else {
            it('shouldt return string[]', () => {
              return partitioner.getAdditionalImports(source, checkableBlocks)
                .then(result => {
                  expect(result).toEqual(expect.any(Array))
                  if (result.length>=1) {
                    expect(result).toContainEqual(expect.any(String))
                  }
                })
            })
          }
        })
        describe('test correct results:', () => {
          it('shouldt return all additional imports', async () => {
            const importFiles = checkableBlocks.map(blockName => path.join(source, blockName, path.basename(partitionerSettings.importsFilePath)))
            const testValues = importFiles.reduce((additionalImports, importFile) => {
              const temp = dataForPartitioner.requireMock.get(path.resolve(importFile))
              return additionalImports.concat(temp || [])
            }, [])
            const result = await partitioner.getAdditionalImports(source, checkableBlocks).catch(e => e)
            expect(result).toEqual(expect.arrayContaining(testValues))
            expect(testValues).toEqual(expect.arrayContaining(result))
          })
        })
        describe('test calling support functions:', () => {
          it('shouldt call partitionBlocksFromPath selfInputs', async () => {
            jest.clearAllMocks()
            const checkableFiles = checkableBlocks.map(block => path.join(block, path.basename(partitionerSettings.importsFilePath)))
            await partitioner.getAdditionalImports(source, checkableBlocks).catch(e => e)
            expect(partitioner.partitionBlocksFromPath).toBeCalledTimes(1)
            expect(partitioner.partitionBlocksFromPath).toBeCalledWith(source, new Set(checkableFiles), expect.any(Number))
          })
        })
      })
    })
  })
  describe('getPartitionBlocksWisAdditionalImportsFrom method:', function(this: typeof partitioner) {
    it('shouldt toBe', () => {
      expect(partitioner.getPartitionWisAdditionalBlocksFrom).toBeDefined()
    })
    it('shouldt return { exists, notExists, additional: string[] }', async () => {
      const result = await partitioner.getPartitionWisAdditionalBlocksFrom('djfgh', ['fghtdfgh', 'fdsg'])
      expect(result).toMatchObject({
        exists: expect.any(Array),
        notExists: expect.any(Array),
        additional: expect.any(Array),
      })
      if (result.exists.length > 0)
        expect(result.exists[0]).toEqual(expect.any(String))
      if (result.notExists.length > 0)
        expect(result.notExists[0]).toEqual(expect.any(String))
      if (result.additional.length > 0)
        expect(result.additional[0]).toEqual(expect.any(String))
    })
    describe.each([...dataForPartitioner.requireMock.keys()])('imports from: %s', importsPath => {
      const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
      describe.each(partitionerSettings.sources)('testings in: %s\n', source => {
        it('shouldt return results:', async () => {
          const result = await partitioner.getPartitionWisAdditionalBlocksFrom(source, checkableBlocks)
          expect(result).toMatchObject({
            exists: expect.any(Array),
            notExists: expect.any(Array),
            additional: expect.any(Array),
          })
          if (result.exists.length > 0)
            expect(result.exists[0]).toEqual(expect.any(String))
          if (result.notExists.length > 0)
            expect(result.notExists[0]).toEqual(expect.any(String))
          if (result.additional.length > 0)
            expect(result.additional[0]).toEqual(expect.any(String))
        })
        describe('shouldt calling support functions:', () => {
          it('shouldt call partitionBlocksFromPath', async () => {
            jest.clearAllMocks()
            const result = await partitioner.getPartitionWisAdditionalBlocksFrom(source, checkableBlocks)
            expect(partitioner.partitionBlocksFromPath).toBeCalled()
            expect((partitioner.partitionBlocksFromPath as jest.Mock).mock.calls.length).toBeLessThanOrEqual(2)
            expect(partitioner.partitionBlocksFromPath).toHaveBeenNthCalledWith(1, source, new Set(checkableBlocks))
            expect(partitioner.partitionBlocksFromPath).toReturn()
            expect(await (partitioner.partitionBlocksFromPath as jest.Mock).mock.results[0].value)
              .toMatchObject({ exists: result.exists, notExists: result.notExists })
            })
            it('shouldt call getAdditionalImports', async () => {
              jest.clearAllMocks()
              const result = await partitioner.getPartitionWisAdditionalBlocksFrom(source, checkableBlocks)
              if (result.exists.length >= 1) {
                expect(partitioner.getAdditionalImports).toBeCalled()
              }
              const CalledTimes = (partitioner.getAdditionalImports as jest.Mock).mock.calls.length
              expect(CalledTimes).toBeLessThanOrEqual(1)
              if (CalledTimes >= 1) {
                expect(partitioner.getAdditionalImports).toHaveBeenNthCalledWith(1, source, result.exists)
                expect(partitioner.getAdditionalImports).toReturn()
                expect(await (partitioner.getAdditionalImports as jest.Mock).mock.results[0].value)
                  .toEqual(result.additional)
              }
            })
        })
        describe('shouldt return correct results:', () => {
          it('shouldt result.exists concat result.notExists <=> input', async() => {
            const result = await partitioner.getPartitionWisAdditionalBlocksFrom(source, checkableBlocks)
            expect(result.exists.concat(result.notExists)).toEqual(expect.arrayContaining(checkableBlocks))
            expect(checkableBlocks).toEqual(expect.arrayContaining(result.exists.concat(result.notExists)))
          })
          it('shouldt result.exists.length + result.notExists.length == input.length', async() => {
            const result = await partitioner.getPartitionWisAdditionalBlocksFrom(source, checkableBlocks)
            expect(result.exists.length + result.notExists.length).toBe(checkableBlocks.length)
          })
        })
      })
    })
  })
  describe('recursivelyPartitiondBlocksFrom method:', function(this: typeof partitioner) {
    it('shouldt toBe ', () => {
      expect(partitioner.recursivelyPartitiondBlocksFrom).toBeDefined()
    })
    it('shouldt return { exists, notExists, additional: string[] }', async () => {
      const result = await partitioner.recursivelyPartitiondBlocksFrom('djfgh', ['fghtdfgh', 'fdsg'])
      expect(result).toMatchObject({
        exists: expect.any(Array),
        notExists: expect.any(Array),
      })
      if (result.exists.length > 0)
        expect(result.exists[0]).toEqual(expect.any(String))
      if (result.notExists.length > 0)
        expect(result.notExists[0]).toEqual(expect.any(String))
    })
    describe.each([...dataForPartitioner.requireMock.keys()])('imports from: %s', importsPath => {
      const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
      describe.each(partitionerSettings.sources)('testings in: %s\n', source => {
        describe('shouldt return correct results:', () => {
          it('result shouldt containing input', async () => {
            const result = await partitioner.recursivelyPartitiondBlocksFrom(source, checkableBlocks)
            expect(result.exists.concat(result.notExists)).toEqual(expect.arrayContaining(checkableBlocks))
          })
        })
      })
    })
  })
  describe('partitionImportsWhereAllSources method:', function(this: typeof partitioner) {
    it('shouldt toBe', () => {
      expect(partitioner.partitionImportsWhereAllSources).toBeDefined()
    })
    it('shouldt return string[] ', async () => {
      const result = await partitioner.partitionImportsWhereAllSources(['fghtdfgh', 'fdsg'])
      expect(result).toMatchObject(expect.any(Array))
      if (result.length >= 1)
        expect(result).toContainEqual(expect.any(String))
    })
    describe.each([...dataForPartitioner.requireMock.keys()])('imports from: %s', importsPath => {
      const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
      describe('shouldt return correct results:', () => {
        it('shouldt return [] for requires from requireMock', () => {
          return partitioner.partitionImportsWhereAllSources(checkableBlocks)
            .then(result => {
              expect(result).toEqual([])
              expect(result).toHaveLength(0)
            })
        })
        it('shouldt return [...notExistsBlocks] for requires from requireMock, concat [...notExistsBlocks]', () => {
          const notExistsBlocks = ['sdifguysodfg', 'dfguliu', 'odufybdfy',]
          const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
          return expect(partitioner.partitionImportsWhereAllSources(notExistsBlocks.concat(checkableBlocks))).resolves.toEqual(notExistsBlocks)
        })
        it('sum all size sets in partitionedImportNames >= input.length', async () => {
          const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
          const result = await partitioner.partitionImportsWhereAllSources(checkableBlocks)
          let allSizes = 0
          for (const nameList of partitioner.partitionedImportNames.values()) {
            allSizes += nameList.size
          }
          expect(allSizes).toBeGreaterThanOrEqual(checkableBlocks.length)
        })
        it('concat all sets in partitionedImportNames consists input', async () => {
          const checkableBlocks = dataForPartitioner.requireMock.get(importsPath)
          const result = await partitioner.partitionImportsWhereAllSources(checkableBlocks)
          let concatedPartitionedImportNames = []
          for (const nameList of partitioner.partitionedImportNames.values()) {
            concatedPartitionedImportNames.push(...nameList)
          }
          expect(concatedPartitionedImportNames).toEqual(expect.arrayContaining(checkableBlocks))
        })
      })
    })
  })
})
describe('PartitionImports class it ones created:', () => {
  let partitioner: PartitionImports
  let dataForPartitioner = new PartitionImportsTestDate()
  let partitionerSettings = PartitionImportsTestDate.partitionerSettings();
  beforeAll(() => {
    jest.clearAllMocks()
    partitioner = new PartitionImports(partitionerSettings);
  })
  it('shouldt toBe implements PartitionImports', () => {
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
    })
    it('shouldt call getImportsFrom with self input', () => {
      expect(partitioner.getImportsFrom).toBeCalled()
      expect(partitioner.getImportsFrom).toBeCalledWith(partitionerSettings.importsFilePath)
    })
  })
})
