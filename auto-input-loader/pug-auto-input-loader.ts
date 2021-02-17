/** @type {import('node')} */
import {importsPug} from './auto-input-core/importGenerators/importsPug'
module.exports = function (source) {
  importsPug(this.context);
  return source
}
