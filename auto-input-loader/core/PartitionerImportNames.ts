import { ImportNamesCollection, NamesList, InterfacePartitionerImportNames, SettingsPartitionerImportNames } from './types'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'


class PartitionerImportNames implements InterfacePartitionerImportNames{
  protected readonly separateImportNames: ImportNamesCollection = new Map()
  protected readonly sources: string[];
  protected readonly importsFileName: string;
  constructor(settings: SettingsPartitionerImportNames) {
    settings.sources.forEach(source => this.separateImportNames.set(source, new Set))
    this.sources = [].concat(settings.sources)
    this.importsFileName = path.basename(settings.importsFilePath)
  }
  protected checkExistsPromise(absolutePath: string, fsConstant = fsConstants.F_OK) {
    return fsPromises.access(path.resolve(`src/${absolutePath}`), fsConstant)
  }
  protected getImportsFrom(absolutePath: string): string[] {
    return require(path.resolve(`src/${absolutePath}`))
  }
  getSeparateNames() {
    return this.separateImportNames
  }
}

export {
  PartitionerImportNames,
}
