declare type NamesList = Set<string>
declare type ImportNamesCollection = Map<string, NamesList>
declare type SettingsPartitionImports = {
  importsFilePath: string,
  sources: string[],
}
declare interface InterfacePartitionImports{
  getPartitionedNames(): ImportNamesCollection,
}
declare type SettingsParserResolves = {
  sources: string[],
  startImportFilePath: string,
  parsedImportFilesGenerators: Map<string, (filePath: string) => string>,
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
  SettingsPartitionImports,
  InterfacePartitionImports,
}
