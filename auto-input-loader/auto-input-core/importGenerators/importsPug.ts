const fsPromises = require('fs').promises
import {separateImportNames} from './separateImportNames'
const componentsPath = 'components';
// folders path
const simplePath = `${componentsPath}/simple`;
const complicatedPath = `${componentsPath}/complicated`;
const includeKeyword = 'include ';
export function importsPug(startDirectory: string) {
  return separateImportNames(startDirectory)
    .then(nameLists => {
      let pugImports = ''
      if (nameLists.complicatedImportNameList.size >= 1) {
        const includePref = `${includeKeyword}/${complicatedPath}/`;
        pugImports += Array.from(nameLists.complicatedImportNameList)
          .reduce((fullImports, blockName) => `${fullImports}\n${includePref}${blockName}/${blockName}`, '')
      }
      if (nameLists.simpleImportNameList.size >= 1) {
        const includePref = `${includeKeyword}/${simplePath}/`;
        pugImports += Array.from(nameLists.simpleImportNameList)
          .reduce((fullImports, blockName) => `${fullImports}\n${includePref}${blockName}/${blockName}`, '')
      }
      return pugImports;
    })
    .then(pugImports => fsPromises.writeFile(`${startDirectory}/import.pug`, pugImports))
    .catch(e => e)
};
