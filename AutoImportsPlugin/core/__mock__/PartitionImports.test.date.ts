import path = require('path')
import { pathToFileURL } from 'url'
const importsFileName = 'import.json'
const FileSistemShot = new Map([
  ['src/components/complicated',
    [
      'complicated_and_simple_import',
      `complicated_and_simple_import/${importsFileName}`,
      'not_use_complicated',
      `not_use_complicated/${importsFileName}`,
      'only_simple_import',
      `only_simple_import/${importsFileName}`,
      'unical_complicated_import',
      `unical_complicated_import/${importsFileName}`,
      'not_fierst_import',
      `not_fierst_import/${importsFileName}`,
    ]],
  ['src/components/simple',
    [
      'base',
      'base1',
      'base2',
      'base3',
      'base4',
      'text',
      'text2',
    ]],
  // ['', new Set(['',])],
])
const requires = new Map([
  [`src/components/complicated/complicated_and_simple_import/${importsFileName}`,
    [
      'only_simple_import',
      'base2',
    ]],
  [`src/components/complicated/not_use_complicated/${importsFileName}`,
    [
      'base4',
      'only_simple_import',
    ]],
  [`src/components/complicated/only_simple_import/${importsFileName}`,
    [
      'base',
      'base3',
    ]],
  [`src/components/complicated/unical_complicated_import/${importsFileName}`,
    [
      'not_fierst_import',
      'base',
    ]],
  [`src/components/complicated/not_fierst_import/${importsFileName}`,
    [
      'complicated_and_simple_import',
      'base',
    ]],
  [`test/${importsFileName}`,
      [
        'complicated_and_simple_import',
        'only_simple_import',
        'unical_complicated_import',
        'text2',
        'base2',
      ]]
  // ['',
  //   [
  //     '',
  //   ]],
])
class PartitionImportsTestDate {
  importsFileName = importsFileName
  static partitionerSettings() {
    return {
      importsFilePath: path.resolve(`test/${importsFileName}`),
      sources: [...FileSistemShot.keys()]
    }
  }
  fileSistemShot = FileSistemShot
  fsMock = this.pather(FileSistemShot)
  requireMock = this.oneRancPather(requires)
  resultsMock = this.oneRancPather(new Map([
    ['src/components/complicated',
      [
        'complicated_and_simple_import',
        'only_simple_import',
        'unical_complicated_import',
        'not_fierst_import',
      ]],
    ['src/components/simple',
      [
        'base',
        'base2',
        'base3',
        'text2',
      ]]
  ]))
  resultsExcludesMock = this.oneRancPather(new Map([
    ['src/components/complicated',
      [
        'not_use_complicated',
      ]],
    ['src/components/simple',
      [
        'base1',
        'base4',
        'text',
      ]]
  ]))
  private pather(fsMap: Map<string, string[]>): Set<string> {
    const fsMock: Set<string> = new Set()
    fsMap.forEach((value, key) => {
      value.forEach(element => fsMock.add(path.resolve(key, element)))
    })
    return fsMock
  }
  private oneRancPather(fsMap: Map<string, string[]>): Map<string, string[]>{
    const fsMock: Map<string, string[]> = new Map()
    for (const key of fsMap.keys()) {
      fsMock.set(path.resolve(key), fsMap.get(key))
    }
    return fsMock
  }
}
export {
  PartitionImportsTestDate,
}
