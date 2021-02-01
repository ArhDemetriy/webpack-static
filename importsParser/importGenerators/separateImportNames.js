module.exports = async function separateImportNames(startDirectory) {
  // librares
  const path = require('path')
  const fs = require('fs')
  const fsPromises = fs.promises
  const componentsPath = 'components'
  // folders path
  const simplePath = `${componentsPath}/simple`
  const complicatedPath = `${componentsPath}/complicated`
  // lists for exist folder name
  const notCheckedSimpleImportNameList = new Set()
  const complicatedImportNameList = new Set()
  const isExistsPromise = absolutePath =>
    fsPromises.access(path.resolve(`src/${absolutePath}`), fs.constants.F_OK);

  const parseImports = nameImports =>
    Promise.resolve(nameImports)
      .then(nameImports => {
        const temp = new Set(nameImports);
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
        // return temp
      })
      .catch(err => err)
  const parseImportsPromise = parseImports(require(path.resolve(startDirectory, 'import.json')));
  const simpleImportNameList = new Set()
  parseImportsPromise
    .then(() => Promise.all(Array.from(notCheckedSimpleImportNameList).map(name =>
      isExistsPromise(`${simplePath}/${name}`)
        .then(simpleImportNameList.add(name), e => e))))
    .catch(e => e);
  await parseImportsPromise;
  return {
    simpleImportNameList,
    complicatedImportNameList
  }
};
