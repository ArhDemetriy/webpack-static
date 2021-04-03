import { SettingsParserResolves, InterfaceParserResolves, ImportNamesCollection, NamesList ,SettingsPartitionImports} from './types'
import { PartitionImports } from './PartitionImports'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'


class ParserResolves implements InterfaceParserResolves{
  protected partitioner: PartitionImports
  protected readonly importPathsWisExtends: ImportNamesCollection = new Map()
  protected readonly parsedImportFiles: Map<string, string> = new Map()
  protected readonly sources: Array<string>
  protected readonly parsedImportFilesGenerators: SettingsParserResolves['parsedImportFilesGenerators']
  protected readonly pathImportFile: string
  constructor(settings: SettingsParserResolves) {
    this.init({ sources: settings.sources, importsFilePath: settings.startImportFilePath })
    this.pathImportFile = path.dirname(settings.startImportFilePath)
    this.parsedImportFilesGenerators = settings.parsedImportFilesGenerators
    this.sources = settings.sources
    for (const importFile of this.parsedImportFilesGenerators.keys()) {
      this.importPathsWisExtends.set(importFile, new Set())
    }
  }
  protected init(q: SettingsPartitionImports) {
    this.partitioner = new PartitionImports(q)
  }
  run() {
    return this.partitioner.getPartitionedNamesAsync()
      .then(importNamesCollection => this.parseImportNames(importNamesCollection))
      .then(importFilesCollection => this.generateImportFiles(importFilesCollection))
      .then(parsedImportFiles => this.saveImportFiles(parsedImportFiles))
  }
  protected saveImportFiles(parsedImportFiles: ParserResolves['parsedImportFiles']) {
    const q: string[] = []
    for (const importFileName of parsedImportFiles.keys()) {
      const importFile = path.resolve(this.pathImportFile, importFileName)
      q.push(importFile)
      fsPromises.writeFile(importFile, parsedImportFiles.get(importFileName))
    }
  }
  protected generateImportFiles(importFilesCollection: ImportNamesCollection) {
    for (const importFile of importFilesCollection.keys()) {
      const importGenerator = this.parsedImportFilesGenerators.get(importFile)
      const importsToFile = [...importFilesCollection.get(importFile).values()]
        .map(importPath => importGenerator(importPath))
      this.parsedImportFiles.set(importFile,importsToFile.join(''))
    }
    return this.parsedImportFiles
  }
  protected parseImportNames(importNamesCollection: ImportNamesCollection) {
    for (const importFile of this.importPathsWisExtends.keys()) {
      const importPathes = this.importPathsWisExtends.get(importFile)
      const importExtend = path.extname(importFile)
      for (const source of importNamesCollection.keys()) {
        for (const importName of importNamesCollection.get(source)) {
          importPathes.add(path.resolve(source, importName, importName.concat(importExtend)))
        }
      }
    }
    return this.importPathsWisExtends
  }
  getPartitionedPaths() {
    return this.importPathsWisExtends
  }
  getPathsFrom(source: string) {
    return this.importPathsWisExtends.get(source)
  }
}
export {
  ParserResolves,
}
