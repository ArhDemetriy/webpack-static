/** @type {import('node')} */
import { AutoInputOptions } from './types'
import {promises} from 'fs'
import {separateImportNames} from './separateImportNames'
const componentsPath = 'components';
// folders path
const simplePath = `${componentsPath}/simple`;
const complicatedPath = `${componentsPath}/complicated`;
const includeKeyword = 'include ';
export function importsPug(startDirectory: string, options: AutoInputOptions) {
  return separateImportNames(startDirectory, options)
    .then(nameLists => {
      let pugImports = ''
      if (nameLists.complicatedImportNameList.size >= 1) {
        const includePref = `${includeKeyword}/${complicatedPath}/`;
        pugImports += Array.from(nameLists.complicatedImportNameList)
          .reduce((fullImports, blockName) => `${fullImports}${includePref}${blockName}/${blockName}\n`, '')
      }
      if (nameLists.simpleImportNameList.size >= 1) {
        const includePref = `${includeKeyword}/${simplePath}/`;
        pugImports += Array.from(nameLists.simpleImportNameList)
          .reduce((fullImports, blockName) => `${fullImports}${includePref}${blockName}/${blockName}\n`, '')
      }
      return pugImports;
    })
    .then(pugImports => promises.writeFile(`${startDirectory}/import.pug`, pugImports))
    .catch(e => e)
};
