/** @type {import('node')} */
import { AutoInputOptions } from './types'
import { importsPug } from './importsPug'
import path from 'path'

export default function (source) {
  const options: AutoInputOptions = Object.assign(
    {
      basenameImportsFile: `importsFile`,
      extnameImportsFile: path.extname(this.resourcePath),
      importGenerator: importPath => importPath,
    },
    this.loaders[this.loaderIndex].options
  )
  importsPug.call(this, this.context, options);
  return source
}
