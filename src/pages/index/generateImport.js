(async (params) => {
  // librares
  const path = require('path')
  const fs = require('fs')
  const fsPromises = fs.promises
  // input importsName
  // const nameImports = (() => {
  //   const nameImports = require(path.resolve(__dirname, 'import.json'))
  //   if (!Array.isArray(nameImports)) throw new Error('import.json is not array')
  //   return Array.from(new Set(nameImports))
  // })()
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
        console.log(nameImports);
        const temp = new Set(nameImports);
        complicatedImportNameList.forEach(value => temp.delete(value));
        notCheckedSimpleImportNameList.forEach(value => temp.delete(value));
        if (temp.size <= 0) throw new Error('nameImports.size <= 0 or nameImports is not iterable');
        return Array.from(temp);
      })
      .then(nameImports => {
        console.log(nameImports);
        const temp = Promise.all(nameImports.map(name => {
          isExistsPromise(`${complicatedPath}/${name}`)
            .catch(() => Promise.reject(notCheckedSimpleImportNameList.add(name),console.log('add simple')))
            .then(exists => {
              complicatedImportNameList.add(name);
              return isExistsPromise(`${complicatedPath}/${name}/import.json`);
            })
            .then(() => require(path.resolve(`src/${complicatedPath}/${name}`, 'import.json')))
            // .catch(err => Promise.reject(err))
            .then(additionalImports => parseImports(additionalImports))
            .catch(err => err)
            // .finally(() => {
            //   console.log(complicatedImportNameList);
            //   console.log(notCheckedSimpleImportNameList);
            // })
        }));
        console.log('name');

        // return Promise.allSettled(temp);
        return temp
      })
      .catch(err => err)
      // .finally(() => {
      //   console.log(complicatedImportNameList);
      //   console.log(notCheckedSimpleImportNameList);
      // })





      // // const checkingNameImportsPromises = nameImports.map((name, _, array) =>
      // const checkingNameImportsPromises = []
      // for (let i = 0; true; i++){
        //   console.log(nameImports.length);
  //   if (i >= nameImports.length) break;
  //   const name = nameImports[i];
  //   checkingNameImportsPromises.push(isExistsPromise(`${complicatedPath}/${name}`)
  //     .catch(() => Promise.reject(notCheckedSimpleImportNameList.add(name)))
  //     .then(exists => {
    //       complicatedImportNameList.add(name);
    //       return isExistsPromise(`${complicatedPath}/${name}/import.json`);
    //     })
    //     .then(existsadditionalImports => {
  //       // console.log(`\n есть дополнительные импорты\n ${path.resolve(`src/${complicatedPath}/${name}`, 'import.json')}`);
  //       const temp = new Set(require(path.resolve(`src/${complicatedPath}/${name}`, 'import.json')));
  //       if (temp.size <= 0) throw new Error(`${complicatedPath}/${name}/import.json empty or no iterable`);
  //       // console.log('temp: ', temp);
  //       return temp;
  //     })
  //     .then(additionalImports => {
  //       // notCheckedSimpleImportNameList.add(additionalImports);
  //       console.log('additionalImports', additionalImports);
  //       console.log('array', nameImports);
  //       nameImports.forEach(value => additionalImports.delete(value));
  //       console.log('additionalImports', additionalImports);
  //       if (additionalImports.size >= 1)
  //         nameImports.push(...additionalImports)
  //       console.log('array', nameImports);
  //       console.log('****************');
  //       return Promise.reject(`${additionalImports.size} additionalImports`)
  //     })
  //     .catch(e => e));
  // }
  const parseImportsPromise = parseImports(require(path.resolve(__dirname, 'import.json')))
    .finally(() => {
      console.log(complicatedImportNameList);
      console.log(notCheckedSimpleImportNameList);

  })
  await parseImportsPromise;
  console.log(complicatedImportNameList);
  console.log(notCheckedSimpleImportNameList);



  // console.log(notCheckedSimpleImportNameList);
  // console.log(complicatedImportNameList);

  const simpleImportNameList = new Set()
  const checkSimpleImportNameList = Promise.all(Array.from(notCheckedSimpleImportNameList).map(name =>
    isExistsPromise(`${simplePath}/${name}`)
      .then(simpleImportNameList.add(name), e => e)));

  const includeKeyword = 'include '
  let includePref = ''
  if (complicatedImportNameList.size >= 1) {
    includePref = `${includeKeyword}/${complicatedPath}/`
    console.log(includePref + Array.from(complicatedImportNameList).join(`\n${includePref}`));}
  await checkSimpleImportNameList;
  if (simpleImportNameList.size >= 1) {
    includePref = `${includeKeyword}/${simplePath}/`
    console.log(includePref + Array.from(simpleImportNameList).join(`\n${includePref}`));}

})()












