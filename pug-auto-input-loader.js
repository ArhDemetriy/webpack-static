const fs = require('fs').promises
const importsPug = require('./importsParser/importGenerators/importsPug');
module.exports = function (source) {
  console.log('***********'+this.context)
  console.log(this)
  // fs.writeFile(`${this.context}/this.js`,  Object.entries(this)  )
  console.log('***********')
  // fs.writeFile(`${this.context}/source.json`, JSON.stringify(source) )
  importsPug(this.context);
  return source
}
