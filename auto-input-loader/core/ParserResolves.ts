import { SettingsParserResolves, InterfaceParserResolves, ImportNamesCollection, NamesList } from './types'

class ParserResolves implements InterfaceParserResolves{
  protected readonly separateImportPaths: ImportNamesCollection = new Map()
  protected readonly sources: Array<string>
  constructor(settings: SettingsParserResolves) {
    settings.sources.forEach(source => this.separateImportPaths.set(source, new Set))
    this.sources = [...this.separateImportPaths.keys()]
  }
  getSeparatedPaths() {
    return this.separateImportPaths
  }
  getPathsFrom(source: string) {
    return this.separateImportPaths.get(source)
  }
}
export {
  ParserResolves,
}
