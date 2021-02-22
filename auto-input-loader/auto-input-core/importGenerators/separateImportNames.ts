/** @type {import('node')} */
import path = require('path')
import { constants as fsConstsnts, promises as fsPromises } from 'fs'

const componentsPath = 'components'
const simplePath = `${componentsPath}/simple`
const complicatedPath = `${componentsPath}/complicated`

export async function separateImportNames(startDirectory) {
  // lists for exist folder name
  const notCheckedSimpleImportNameList: Set<string> = new Set()
  const complicatedImportNameList: Set<string> = new Set()
  const isExistsPromise = absolutePath =>{
    return fsPromises.access(path.resolve(`src/${absolutePath}`), fsConstsnts.F_OK);
  }


  const parseImports = (nameImports: string[]) =>
    Promise.resolve(nameImports)
      .then(nameImports => {
        const temp: Set<string> = new Set(nameImports);
        complicatedImportNameList.forEach(value => temp.delete(value));
        notCheckedSimpleImportNameList.forEach(value => temp.delete(value));
        if (temp.size <= 0) throw new Error('nameImports.size <= 0 or nameImports is not iterable');
        return Array.from(temp);
      })
      .then(nameImports => {
        const temp = nameImports.map(name => isExistsPromise(`${complicatedPath}/${name}`)
          .catch(() => Promise.reject(notCheckedSimpleImportNameList.add(name)))
          .then(exists => {
            complicatedImportNameList.add(name);
            return isExistsPromise(`${complicatedPath}/${name}/import.json`);
          })
          .then(() => require(path.resolve(`src/${complicatedPath}/${name}`, 'import.json')))
          .then(additionalImports => parseImports(additionalImports))
          .catch(err => err)
        );
        return Promise.allSettled(temp);
      })
      .catch(err => err)
  await parseImports(require(path.resolve(startDirectory, 'import.json')));
  const simpleImportNameList: Set<string> = new Set()
  await Promise.allSettled(Array.from(notCheckedSimpleImportNameList).map(name => isExistsPromise(`${simplePath}/${name}`)
    .then(exists => simpleImportNameList.add(name))))
    .catch(e => e);

  return {
    simpleImportNameList,
    complicatedImportNameList
  }
};
