declare type AutoInputOptions =
  {
    importGenerator: (this: AutoInputOptions, importPath: string) => string,
    extnameImportsFile: string,
    basenameImportsFile: string,
    sourcePaths: string[]
  }
export {
  AutoInputOptions
}
