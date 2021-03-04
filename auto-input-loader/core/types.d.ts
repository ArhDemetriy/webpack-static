declare type SettingsParserResolves = {
  sources: string[]
}
declare type NamesList = Set<string>
declare type ImportNamesCollection = Map<string,NamesList>
declare interface ParserResolvesInterface{
  getSeparatedPaths(): ImportNamesCollection,
  getPathsFrom(source: string): NamesList,
}
export {
  SettingsParserResolves,
  ParserResolvesInterface,
  ImportNamesCollection,
  NamesList,
}
