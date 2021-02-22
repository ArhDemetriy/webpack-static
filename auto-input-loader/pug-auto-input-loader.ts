/** @type {import('node')} */
import { importsPug } from './auto-input-core/importGenerators/importsPug'

type AutoInputOptions =
  {
    importGenerator: (this: AutoInputOptions, importPath: string) => string,
    extnameImportsFile: string,
    basenameImportsFile: string,
  }
export {
  AutoInputOptions
}
export default function (source) {
  const options: AutoInputOptions = Object.assign(
    {
      importsFileBasename: `importsFile`,
      importGenerator: importPath => importPath,
    },
    this.loaders[this.loaderIndex].options
  )
  importsPug.call(this, this.context, options);
  return source
}
