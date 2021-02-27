/** @type {import('node')} */
import { AutoInputOptions } from '../types'
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
  return parseManySource
}

export {
  FinderPathFromNames,
}
