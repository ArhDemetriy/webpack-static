/** @type {import('node')} */
import { AutoInputOptions } from './types'
import { SettingsParserResolves } from "./core/types"
import path = require('path')

export default function (source) {
  const options: AutoInputOptions = this.loaders[this.loaderIndex].options
  const coreSettings: SettingsParserResolves = {
    sources: options.sources,
    parsedImportFilesGenerators: options.parsedImportFilesGenerators,
    startImportFilePath: path.join(path.dirname(this.resourcePath), options.startImportFileName)
  }
  return source
}
