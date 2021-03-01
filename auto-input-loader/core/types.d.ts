declare type SettingsImportNamesSeparator = {
  sources: string[]
}
declare interface ImportNamesSeparatorInterface{
  getSeparateImportNames(): Map<string, Set<string>>,
  getImportsNamesFrom(source: string): Set<string>,
}
export {
  SettingsImportNamesSeparator,
  ImportNamesSeparatorInterface,
}
