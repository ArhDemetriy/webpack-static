import { ImportNamesCollection, NamesList, InterfacePartitionerImportNames, SettingsPartitionerImportNames } from './types'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'
class PartitionerImportNames implements InterfacePartitionerImportNames{
  protected readonly partitionedImportNames: ImportNamesCollection = new Map()
  protected readonly sources: string[];
  protected readonly importsFileName: string;
  constructor(settings: SettingsPartitionerImportNames) {
    settings.sources.forEach(source => this.partitionedImportNames.set(source, new Set))
    this.sources = [].concat(settings.sources)
    this.importsFileName = path.basename(settings.importsFilePath)
    this.fierstStep(settings.importsFilePath)
  }
  getPartitionedNames() {
    return this.partitionedImportNames
  }
  protected checkExistsPromise(absolutePath: string, fsConstant = fsConstants.F_OK) {
    return fsPromises.access(path.resolve(`${absolutePath}`), fsConstant)
  }
  protected getImportsFrom(absolutePath: string): string[] {
    return require(path.resolve(`${absolutePath}`))
  }
  protected fierstStep(importsFilePath: string) {
    return this.getImportsFrom(importsFilePath)
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
  protected async getAdditionalImports(where: string, checkableBlocks: string[]) {
    if (checkableBlocks.length <= 0) return Promise.reject([])
    const checkableFiles = new Set(checkableBlocks.map(block => path.join(block, this.importsFileName)))
    const existsFiles = (await this.partitionBlocksFromPath(where, checkableFiles, fsConstants.R_OK)).exists
    const result: string[] = []
    for (const fileName of existsFiles) {
      result.push(...this.getImportsFrom(path.resolve(where, fileName)))
    }
    if (result.length <= 0)
      return Promise.reject([])
    else
      return Promise.resolve(result)
  }
}
export {
  PartitionerImportNames,
}
