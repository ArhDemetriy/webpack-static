import { SettingsParserResolves, InterfaceParserResolves, ImportNamesCollection, NamesList } from './types'

class ParserResolves implements InterfaceParserResolves{
  protected readonly partitionedImportPaths: ImportNamesCollection = new Map()
  protected readonly sources: Array<string>
  constructor(settings: SettingsParserResolves) {
    settings.sources.forEach(source => this.partitionedImportPaths.set(source, new Set))
    this.sources = [...this.partitionedImportPaths.keys()]
  }
  getPartitionedPaths() {
    return this.partitionedImportPaths
  }
  getPathsFrom(source: string) {
    return this.partitionedImportPaths.get(source)
  }
}
export {
  ParserResolves,
}
