import { ImportNamesCollection } from './types'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'


class SeparaterImportNames{
  protected readonly separateImportNames: ImportNamesCollection = new Map()
  protected readonly sources: string[];
  protected readonly importsFileName: string;
  constructor(settings: { importsFileName: string, sources: string[], }) {
    settings.sources.forEach(source => this.separateImportNames.set(source, new Set))
    this.sources = [].concat(settings.sources)
    this.importsFileName = settings.importsFileName
  }

  testMockPromise(absolutePath: string) {
    return this.checkExistsPromise(absolutePath)
  }
  testMockSync(absolutePath: string) {
    return this.getImportsFrom(absolutePath)
  }

  protected readonly checkExistsPromise = (absolutePath: string, fsConstant = fsConstants.F_OK) => {
    return fsPromises.access(path.resolve(`src/${absolutePath}`), fsConstant)
  }
  protected readonly getImportsFrom = (absolutePath: string): string[] => {
    return require(path.resolve(`src/${absolutePath}`))
  }
}

export {
  SeparaterImportNames,
}
