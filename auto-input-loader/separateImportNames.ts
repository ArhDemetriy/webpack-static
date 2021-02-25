/** @type {import('node')} */
import { AutoInputOptions } from './types'
import path = require('path')
import { constants as fsConstants, promises as fsPromises } from 'fs'

class FinderPathFromNames{
  protected readonly startDirectory: string
  protected readonly startFile: string
  protected readonly nameImportsFile: string
  // имена импортируемых файлов разделёные по их родительским каталогам взятым из sourcePaths
  protected readonly nameLists: Map<String,Set<string>>
  protected parseNameImports = factoryParsePromise()
  constructor(startFile: string, sourcePaths: AutoInputOptions['sourcePaths']) {
    this.startFile = startFile
    this.nameImportsFile = path.basename(this.startFile)
    this.startDirectory = path.dirname(this.startFile)
    this.nameLists = new Map(sourcePaths.map(sourcePath => [sourcePath, new Set()]))
    this.setNameImports()
  }
  // protected readonly notCheckedNameList: Set<string> = new Set()
  // protected readonly additionalNamesList: Set<string> = new Set()
  protected delDublicateFrom(nameList: Set<string>) {
    for (let names of this.nameLists.values()) {
      if (nameList.size <= 0) break;
      names.forEach(name => nameList.delete(name))
    }
    return nameList
  }
  protected setNameImports() {
    const q = require(this.startFile)
    this.parseNameImports(q)
  }
  getParsedNameLists() {
    return this.nameLists
  }



}

function factoryParsePromise():
  // (sources: number | Map<any, any> | Array<any> | Set<any>):
  (this: FinderPathFromNames, nameImports: string[]) => Promise<Set<string>>
{
  let newNameWasAdded = false
  const checkExistsPromise = (absolutePath: string, fsConstant = fsConstants.F_OK) => {
    return fsPromises.access(path.resolve(`src/${absolutePath}`), fsConstant)
  }
  const getImportsFrom = (absolutePath: string): string[] => {
    return require(path.resolve(`src/${absolutePath}`))
  }
//   function parseWithoutSource(this: FinderPathFromNames, nameImports: string[]) {
//     return Promise.resolve(new Set() as Set<string>)
//   }
//   function parseOneSource(this: FinderPathFromNames, nameImports: string[]) {
//     if (nameImports.length <= 0) return
//     const source = [...this.nameLists.keys()][0]
//     const nameList = this.nameLists.get(source)
//     const promises = Array.from(new Set(nameImports)).map(name => {
//       return checkExistsPromise(`${source}/${name}`)
//         .then(existsImportedDirectory => {
//           nameList.add(`${source}/${name}/${name}`)
//           return checkExistsPromise(`${source}/${name}/${this.nameImportsFile}`)
//         })
//         .then(existsAdditionalImports => getImportsFrom(`${source}/${name}/${this.nameImportsFile}`))
//         .then(additionalImports => {
//           additionalImports.forEach(importName => this.additionalNamesList.add(importName))
//           return additionalImports
//         })
//         .catch(():string[] => [])
//     })
//     return Promise.all(promises)
//       // ts(2472) если в конфиг добавить target: ES*, то полетят импорты.
//       // а без этой настройки расширение в new нельзя использовать
//       .then((additionalImports): Set<string> => new Set([].concat(...additionalImports)))
//   }

//   function parseTwoSource(this: FinderPathFromNames, nameImports: string[]) {
//     if (nameImports.length <= 0)
//       return Promise.resolve(new Set() as Set<string>)
//     const sources = [...this.nameLists.keys()].slice(0, 2) as [string, string]
//     const nameList = [this.nameLists.get(sources[0]), this.nameLists.get(sources[1])] as [Set<String>, Set<String>]
//     const promises = sources.map(source => {

//      })

//  }
  function saveNamesInSourceToNameLists(this: FinderPathFromNames, nameImports: string[], source: string) {
    const nameList = this.nameLists.get(source)
    const saversNameImportsInSource = nameImports.map(name => {
      return checkExistsPromise(`${source}/${name}`)
        .catch(() => Promise.reject([name]))
        .then(existsImportedDirectory => {
          if (nameList.has(name))
            return Promise.reject()
          else
            return Promise.resolve()
         })
        .then(nameIsNotIncluded => {
          nameList.add(name)
          newNameWasAdded = true;
          return checkExistsPromise(`${source}/${name}/${this.nameImportsFile}`, fsConstants.R_OK)
        })
        .then(existsAdditionalImports => getImportsFrom(`${source}/${name}/${this.nameImportsFile}`))
        .catch(():string[] => [])
    })
    const agregaterAdditionalImports = Promise.allSettled(saversNameImportsInSource)
      .then(allPromisesResult => {
        return allPromisesResult.map(promiseResult => {
          if (promiseResult.status = 'fulfilled') {
            return (promiseResult as PromiseFulfilledResult<string[]>).value
          } else {
            return (promiseResult as PromiseRejectedResult).reason as string[]
          }
        })
      })
      .then(arrayOfArraysOfSources => [].concat(...arrayOfArraysOfSources) as string[])
      // .then(arrayOfSources => Array.from(this.delDublicateFrom(new Set(arrayOfSources))))
      .catch((): string[] => [])
    return agregaterAdditionalImports
  }

  async function parseManySource(this: FinderPathFromNames, nameImports: string[]) {
    let additionalImports = new Set(nameImports)
    const sources = [...this.nameLists.keys()]
    newNameWasAdded = false
    for (let i = 0; additionalImports.size > 0; i++){
      if (i >= sources.length) {
        if (newNameWasAdded){
          i = 0
          newNameWasAdded = false
        } else {
          break
        }
      }
      additionalImports = new Set
        (await saveNamesInSourceToNameLists.call(this, additionalImports, sources[i]))
    }
    return additionalImports
  }

  // const length: number = (sources => {
  //   const temp = (sources as Array<any>).length | (sources as Map<any, any> | Set<any>).size | NaN
  //   if (temp > 0) return temp
  //   else return 0
  // })(sources)
  // if (length < 1) return parseWithoutSource
  // else if (length <= 1) return parseOneSource
  // else if (length <= 2) return parseTwoSource
  // else if (length > 2) return parseManySource
  return parseManySource
}



async function separateImportNames(startDirectory: string, options: AutoInputOptions) {
  // lists for exist folder name
const componentsPath = 'components'
const simplePath = `${componentsPath}/simple`
const complicatedPath = `${componentsPath}/complicated`
  const notCheckedSimpleImportNameList: Set<string> = new Set()
  const complicatedImportNameList: Set<string> = new Set()
  const isExistsPromise = absolutePath =>{
    return fsPromises.access(path.resolve(`src/${absolutePath}`), fsConstants.F_OK);
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
  await Promise
    .allSettled(Array.from(notCheckedSimpleImportNameList)
      .map(name => isExistsPromise(`${simplePath}/${name}`)
        .then(exists => simpleImportNameList.add(name))))
    .catch(e => e);

  return {
    simpleImportNameList,
    complicatedImportNameList
  }
};
export {
  separateImportNames,
  FinderPathFromNames,
}
