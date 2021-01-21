(async (params) => {
  // librares
  const path = require('path')
  const fs = require('fs')
  const fsPromises = fs.promises
  // input importsName
  const nameImports = (() => {
    const nameImports = require(path.resolve(__dirname, 'import.json'))
    if (!Array.isArray(nameImports)) throw new Error('import.json is not array')
    return Array.from(new Set(nameImports))
  })()
  const componentsPath = 'components'
  // folders path
  const simplePath = `${componentsPath}/simple`
  const complicatedPath = `${componentsPath}/complicated`
  // lists for exist folder name
  const simpleImportNameList = new Set()
  const complicatedImportNameList = new Set()
  const isExistsPromise = (folder, name) =>
    fsPromises.access(path.resolve(`src/${folder}/${name}`), fs.constants.F_OK)
  const noExistsNames =
    (await Promise.all(nameImports
                        .map(name => isExistsPromise(complicatedPath, name)
                          .then(
                            exists => {
                              complicatedImportNameList.add(name)
                              isExistsPromise(complicatedPath, `${name}/import.json`)
                                .then(
                                  exists => {
                                    const nameImports = (() => {
                                      const nameImports = require(path.resolve(`${complicatedPath}/${name}`, 'import.json'));
                                      if (Array.isArray(nameImports))
                                        return Array.from(new Set(nameImports));
                                    })()

                                    simpleImportNameList.add(name);
                                  },
                                  noExists => {})

                            },
                            noExists => isExistsPromise(simplePath, name)
                              .then(
                                exists => { simpleImportNameList.add(name) },
                                noExists => name))))
    ).filter(v => v)




  console.log('\ncomplicated\n', complicatedImportNameList)
  console.log('\nsimple\n', simpleImportNameList)
  console.log('\nnoExistsNames\n', noExistsNames)

  if (simpleImportNameList.size >= 1) {
    const includePref = '\ninclude /'
    console.log('include /' + Array.from(simpleImportNameList).join(includePref));
  }

})()












