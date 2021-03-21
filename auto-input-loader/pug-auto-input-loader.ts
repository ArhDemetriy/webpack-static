/** @type {import('node')} */
import { AutoInputOptions } from './types'
import { importsPug } from './importsPug'
import path = require('path')

export default function (source) {
  const options: AutoInputOptions = Object.assign(
    {
      basenameImportsFile: `importsFile`,
      extnameImportsFile: path.extname(this.resourcePath),
      importGenerator: importPath => importPath,
    },
    this.loaders[this.loaderIndex].options
  );
  // let q = {
  //   sources: ['src'],
  //   startImportFilePath: this.resourcePath,
  //   parsedImportFilesGenerators: new Map(),
  // };
  importsPug.call(this, this.context, options);
  return source
}
