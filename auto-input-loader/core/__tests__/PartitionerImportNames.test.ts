import { SettingsPartitionerImportNames, ImportNamesCollection, NamesList } from '../types'
import { PartitionerImportNames } from '../__mock__/PartitionerImportNames'
import { PartitionerImportNamesTestDate } from '../__mock__/PartitionerImportNames.test.date'
import path = require('path')
describe('PartitionerImportNames class:', () => {
  let dataForPartitioner = new PartitionerImportNamesTestDate()
  let partitionerSettings = PartitionerImportNamesTestDate.partitionerSettings()
  let partitioner = new PartitionerImportNames(partitionerSettings)


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
                expect(partitioner.checkExistsPromise).toBeCalledWith(req)
              }
            })

          })

        })
    })
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





