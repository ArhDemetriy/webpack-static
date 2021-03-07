import { ImportNamesCollection, NamesList, InterfacePartitionerImportNames, SettingsPartitionerImportNames } from './types'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'
type PartitionSearchingResults = {
  exists: Set<string>,
  notExists: Set<string>
}
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
    return fsPromises.access(path.resolve(`src/${absolutePath}`), fsConstant)
  }
  protected getImportsFrom(absolutePath: string): string[] {
    return require(path.resolve(`src/${absolutePath}`))
  }
  protected fierstStep(importsFilePath: string) {
    return this.getImportsFrom(importsFilePath)
  }
  protected async partitionBlocksFromPath(source: string, searcheableBlocks: Set<string>) {
    const searchers: Promise<string>[] = []
    searcheableBlocks.forEach(block => {
      const promise = this.checkExistsPromise(path.resolve(source, block))
        .then(() => block, () => block)
      searchers.push(promise)
    })
    const searchingResults = await Promise.allSettled(searchers)
    const partitionSearchingResults = searchingResults.reduce((aggregator, searchingResult) => {
      if (searchingResult.status == 'fulfilled')
        aggregator.exists.add(searchingResult.value)
      else
        aggregator.notExists.add(searchingResult.reason)
      return aggregator;
    }, { exists: new Set(), notExists: new Set() } as PartitionSearchingResults)
    return partitionSearchingResults
  }
}
export {
  PartitionerImportNames,
}
