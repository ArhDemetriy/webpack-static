const fsPromises = require('fs').promises
const separateImportNames = require('./separateImportNames.js')
const componentsPath = 'components';
// folders path
const simplePath = `${componentsPath}/simple`;
const complicatedPath = `${componentsPath}/complicated`;
const includeKeyword = 'include ';
module.exports = function importsPug(startDirectory) {
  return separateImportNames(startDirectory)
    .then(nameLists => {
      let pugImports = ''
      let includePref = '';
      if (nameLists.complicatedImportNameList.size >= 1) {
        includePref = `${includeKeyword}/${complicatedPath}/`;
        pugImports += includePref + Array.from(nameLists.complicatedImportNameList).join(`\n${includePref}`) + '\n';
      }
      if (nameLists.simpleImportNameList.size >= 1) {
        includePref = `${includeKeyword}/${simplePath}/`;
        pugImports += includePref + Array.from(nameLists.simpleImportNameList).join(`\n${includePref}`) + '\n';
      }
      return pugImports;
    })
    .then(pugImports => fsPromises.writeFile(`${startDirectory}/import.pug`, pugImports))
    .catch(e => console.log(e))
};

