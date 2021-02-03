const fsPromises = require('fs').promises
const importsPug = require('./importsParser/importGenerators/importsPug');
module.exports = function (source) {
  importsPug(this.context);
  return source
}
