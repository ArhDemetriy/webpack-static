declare type NamesList = Set<string>
declare type ImportNamesCollection = Map<string, NamesList>
declare type SettingsPartitionerImportNames = {
  importsFilePath: string,
  sources: string[],
}
declare interface InterfacePartitionerImportNames{
  getPartitionedNames(): ImportNamesCollection,
}
declare type SettingsParserResolves = {
  sources: string[]
}
declare interface InterfaceParserResolves{
  getPartitionedPaths(): ImportNamesCollection,
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
