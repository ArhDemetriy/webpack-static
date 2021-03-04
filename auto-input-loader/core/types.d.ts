declare type NamesList = Set<string>
declare type ImportNamesCollection = Map<string, NamesList>
declare type SettingsSeparaterImportNames = {
  importsFilePath: string,
  sources: string[],
}
declare interface InterfaceSeparaterImportNames{
  getSeparateNames(): ImportNamesCollection,
}
declare type SettingsParserResolves = {
  sources: string[]
}
declare interface InterfaceParserResolves{
  getSeparatedPaths(): ImportNamesCollection,
  getPathsFrom(source: string): NamesList,
}
export {
  NamesList,
  ImportNamesCollection,
  SettingsParserResolves,
  InterfaceParserResolves,
  SettingsSeparaterImportNames,
  InterfaceSeparaterImportNames,
}
