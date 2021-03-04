declare type NamesList = Set<string>
declare type ImportNamesCollection = Map<string, NamesList>
declare type SettingsPartitionerImportNames = {
  importsFilePath: string,
  sources: string[],
}
declare interface InterfacePartitionerImportNames{
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
  SettingsPartitionerImportNames,
  InterfacePartitionerImportNames,
}
