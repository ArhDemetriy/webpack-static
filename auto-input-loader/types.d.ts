declare type AutoInputOptions =
  {
    sources: ['src/components'],
    startImportFileName: string,
    parsedImportFilesGenerators: Map<string, (fileName: string) => string>,
  }
export {
  AutoInputOptions
}
