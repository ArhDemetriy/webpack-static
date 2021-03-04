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
  sources = [...FileSistemShot.keys()]
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
        'not_use_complicated',
        'base',
      ]],
  ])
}
export {
  PartitionerImportNamesTestDate,
}
