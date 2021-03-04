import { F_OK } from 'constants'
import { constants as fsConstants, promises as fsPromises, accessSync } from 'fs'
function qwe() {
  return 'qwe'
}
function checkFile(path:string) {
  try {
    const q = accessSync(path, F_OK) as any
    return true
  } catch (err) {
    return false
  }
}
class MockTesting{
  protected requireFake(source: string) {
    return require(source)
  }
  getDataFromSource(source: string) {
    return this.requireFake(source)
  }
  backdoor() {
    console.log('not mocking');
  }
}

export {
  qwe,
  checkFile,
  MockTesting,
}
