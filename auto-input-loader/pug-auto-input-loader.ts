/** @type {import('node')} */
import { importsPug } from './auto-input-core/importGenerators/importsPug'
// import {Configuration, RuleSetUseItem} from "webpack";
import path = require('path')

type autoInputOptions =
  {
    nameImportsFile: string,
    importGenerator: (this: autoInputOptions, importPath: string) => string,
    extname: string,
    basename: string,
  }
export {
  autoInputOptions
}
export default function (source) {
  const options: autoInputOptions = Object.assign(
    {
      nameImportsFile: `importsFile`,
      importGenerator: importPath => importPath,
      extname: path.extname(this.resourcePath),
      basename: path.basename(this.resourcePath, path.extname(this.resourcePath))
    },
    this.loaders[this.loaderIndex].options
  )

  // if (!(source as string).includes(options.importGenerator(options.nameImportsFile)))
  //   throw new Error(`in "${this.resourcePath}" not imported "${options.nameImportsFile}${options.extname}". Please, add in him this import. Example: ${options.importGenerator(options.nameImportsFile)}`)

  importsPug.call(this, this.context, options);
  return source
}
