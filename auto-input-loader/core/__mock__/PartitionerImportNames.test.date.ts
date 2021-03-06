const importsFileName = 'import.json'
const FileSistemShot = new Map([
  ['src/components/complicated',
    new Set([
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
    ])],
  ['src/components/simple',
    new Set([
      'base',
      'base1',
      'base2',
      'base3',
      'base4',
      'text',
      'text2',
    ])],
  // ['', new Set(['',])],
])
class PartitionerImportNamesTestDate {
  importsFileName = importsFileName
  static partitionerSettings() {
    return {
      importsFilePath: `test/${importsFileName}`,
      sources: [...FileSistemShot.keys()]
    }
  }
  fsMock = (fsMap => {
    const fsMock: Set<string> = new Set()
    fsMap.forEach((value, key) => {
      value.forEach(element => fsMock.add(`${key}/${element}`))
    })
    return fsMock
  })(FileSistemShot)
  requireMock = new Map([
    [`src/components/complicated/complicated_and_simple_import/${this.importsFileName}`,
      [
        'only_simple_import',
        'base2',
      ]],
    [`src/components/complicated/not_use_complicated/${this.importsFileName}`,
      [
        'base4',
        'only_simple_import',
      ]],
    [`src/components/complicated/only_simple_import/${this.importsFileName}`,
      [
        'base',
        'base3',
      ]],
    [`src/components/complicated/unical_complicated_import/${this.importsFileName}`,
      [
        'not_fierst_import',
        'base',
      ]],
    [`src/components/complicated/not_fierst_import/${this.importsFileName}`,
      [
        'complicated_and_simple_import',
        'base',
      ]],
    [PartitionerImportNamesTestDate.partitionerSettings().importsFilePath,
      [
        'complicated_and_simple_import',
        'only_simple_import',
        'unical_complicated_import',
        'text2',
        'base2',
      ]]
  ])
  resultsMock = new Map([
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
  ])
  resultsExcludesMock = new Map([
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
  ])
}
export {
  PartitionerImportNamesTestDate,
}
