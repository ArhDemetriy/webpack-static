import { ImportNamesCollection, NamesList, InterfacePartitionImports, SettingsPartitionImports } from './types'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'
class PartitionImports implements InterfacePartitionImports{
  protected readonly partitionedImportNames: ImportNamesCollection
  protected readonly sources: string[];
  protected readonly importsFileName: string;
  protected notExistsImports: Promise<string[]>;
  constructor(settings: SettingsPartitionImports) {
    this.partitionedImportNames = new Map()
    settings.sources.forEach(source => this.partitionedImportNames.set(source, new Set))
    this.sources = [].concat(settings.sources)
    this.importsFileName = path.basename(settings.importsFilePath)
    this.fierstStep(settings.importsFilePath)
  }
  getPartitionedNames() {
    return this.partitionedImportNames
  }
  getPartitionedNamesAsync() {
    return this.notExistsImports.then(_ => this.partitionedImportNames)
  }
  protected checkExistsPromise(absolutePath: string, fsConstant = fsConstants.F_OK) {
    return fsPromises.access(path.resolve(`${absolutePath}`), fsConstant)
  }
  protected getImportsFrom(absolutePath: string): string[] {
    return require(path.resolve(`${absolutePath}`))
  }
  protected fierstStep(importsFilePath: string) {
    this.notExistsImports = this.partitionImportsWhereAllSources(this.getImportsFrom(importsFilePath))
  }
  protected async partitionBlocksFromPath(source: string, searcheableBlocks: Set<string>, fsConstant = fsConstants.F_OK) {
    const searchers: Promise<string>[] = []
    searcheableBlocks.forEach(block => {
      const promise = this.checkExistsPromise(path.resolve(source, block), fsConstant)
        .then(() => block, () => Promise.reject(block))
      searchers.push(promise)
    })
    const searchingResults = await Promise.allSettled(searchers)
    const partitionSearchingResults = searchingResults.reduce((aggregator, searchingResult) => {
      if (searchingResult.status == 'fulfilled')
        aggregator.exists.push(searchingResult.value)
      else
        aggregator.notExists.push(searchingResult.reason)
      return aggregator;
    }, { exists: [] as string[], notExists: [] as string[] })
    return partitionSearchingResults
  }
  protected async getAdditionalImports(where: string, checkableBlocks: string[]): Promise<string[]> {
    if (checkableBlocks.length <= 0) return Promise.resolve([])
    const checkableFiles = new Set(checkableBlocks.map(block => path.join(block, this.importsFileName)))
    const existsFiles = (await this.partitionBlocksFromPath(where, checkableFiles, fsConstants.R_OK)).exists
    const result: string[] = []
    for (const fileName of existsFiles) {
      result.push(...this.getImportsFrom(path.resolve(where, fileName)))
    }
    return Promise.resolve(result)
  }
  protected async getPartitionWisAdditionalBlocksFrom(where: string, checkableBlocks: string[]) {
    const result: {
      exists: string[],
      notExists: string[],
      additional: string[],
    } = Object.assign(
      { additional: [] },
      await this.partitionBlocksFromPath(where, new Set(checkableBlocks)),
      )
    if (result.exists.length >= 1) {
      result.additional = await this.getAdditionalImports(where, result.exists)
    }
    return result
  }
  protected async recursivelyPartitiondBlocksFrom(where: string, partitionleBlocks: string[]) {
    const result = {
      exists: [] as string[],
      notExists: [] as string[],
    }

    let additional = partitionleBlocks
    do {
      additional = await this.getPartitionWisAdditionalBlocksFrom(where, additional)
        .then(partitionedBlocks => {
          result.exists = result.exists.concat(partitionedBlocks.exists)
          result.notExists = result.notExists.concat(partitionedBlocks.notExists)
          return partitionedBlocks.additional
        })
    } while (additional.length && !additional.every(blockName => result.notExists.includes(blockName)))

    result.notExists = [...(new Set(result.notExists.concat(additional)))]
    result.exists = [...(new Set(result.exists))]

    return result
  }
  protected async partitionImportsWhereAllSources(partitionleImports: string[]) {
    const findedBlocks: Set<string> = new Set()
    let notExists = partitionleImports
    let testArray: string[] = []
    do {
      testArray = [...new Set(testArray.concat(notExists))]
      for (const source of this.sources) {
        const importsFromThisSource = this.partitionedImportNames.get(source)
        notExists = await this.recursivelyPartitiondBlocksFrom(source, notExists)
          .then(partitionedBlocks => {
            partitionedBlocks.exists.forEach(blockName => {
              importsFromThisSource.add(blockName)
              findedBlocks.add(blockName)
            })
            return partitionedBlocks.notExists
          })
        if (notExists.length <= 0) return []
      }
      if (testArray.length < (new Set(notExists)).size) continue
    } while (notExists.length && notExists.some(blockName => !testArray.includes(blockName)))
    if (notExists.length >= 2)
      notExists = [...new Set(notExists)]
    return notExists
  }
}
export {
  PartitionImports,
}
