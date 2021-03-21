/** @type {import('node')} */
import { AutoInputOptions } from './types'
import { SettingsParserResolves } from "./core/types"
import path = require('path')
import { ParserResolves } from "./core/ParserResolves";

export default function (source) {
  const options: AutoInputOptions = this.loaders[this.loaderIndex].options
  const coreSettings: SettingsParserResolves = {
    sources: options.sources,
    parsedImportFilesGenerators: options.parsedImportFilesGenerators,
    startImportFilePath: path.join(path.dirname(this.resourcePath), options.startImportFileName)
  }
  const parserResolves = new ParserResolves(coreSettings)
  parserResolves.run()
  console.log(coreSettings);


  return source
}
