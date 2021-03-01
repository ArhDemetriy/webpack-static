import { SettingsImportNamesSeparator, ImportNamesSeparatorInterface } from './types'

class ImportNamesSeparator implements ImportNamesSeparatorInterface{
  protected readonly separateImportNames: Map<string, Set<string>> = new Map()
  protected readonly sources: Array<string>
  constructor(settings: SettingsImportNamesSeparator) {
    settings.sources.forEach(source => this.separateImportNames.set(source, new Set))
    this.sources = [...this.separateImportNames.keys()]
  }
  getSeparateImportNames() {
    return this.separateImportNames
  }
  getImportsNamesFrom(source: string) {
    return this.separateImportNames.get(source)
  }
}
export {
  ImportNamesSeparator,
  SettingsImportNamesSeparator,
}
