import { SettingsPartitionImports, ImportNamesCollection, NamesList } from '../types'
import { PartitionImportsTestDate } from '../__mock__/PartitionImports.test.date'
import path = require('path')
import { SettingsParserResolves } from '../types'
import { ParserResolves } from '../__mock__/ParserResolves'

describe('ParserResolves class:', () => {
  // let dataForPartitioner = new PartitionImportsTestDate()
  const temp = PartitionImportsTestDate.partitionerSettings()
  let settingsParserResolves: SettingsParserResolves = {
    sources: temp.sources,
    startImportFilePath: temp.importsFilePath,
    parsedImportFilesGenerators: new Map([
      ['imports.pug', (importPath) => `include ${importPath.split('\\').join('/')}\n`],
      ['imports.scss', (importPath) => `@import '${importPath.split('\\').join('/')}';\n`],
    ])
  }
  it('shouldt return ', () => {
    let parser = new ParserResolves(settingsParserResolves)
    return parser.run()
      .then(imports => {
        console.log(imports)
        expect(1).toBe(1)
      })

  },400)

})

