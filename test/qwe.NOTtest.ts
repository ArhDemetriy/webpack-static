/** @type {import('ts-jest')} */
import { qwe ,checkFile, MockTesting} from './qwe'
import {accessSync} from 'fs'

describe('Qwe function:',()=> {
  test('shouldt return samfin', () => {
    expect(qwe()).toBeDefined()
  })
})

jest.mock('fs')

describe('checkFile function:', () => {
  const existsPath = 'test/isArray.json'
  const notExistsPath = 'test/isNull.json';
  (accessSync as unknown as jest.MockInstance<any, [string, number]>).mockImplementation((...args) => {
    switch (args[0]) {
      case existsPath:
        return 'LOL its to soo faked'
      case notExistsPath:
        throw new Error('LOL its faked')
      default:
        return args
    }
  })
  test('shouldt return true for existsPath', () => {
    expect(checkFile(existsPath)).toBeTruthy()
    expect(checkFile(existsPath)).toBe(true)
  })
  test('shouldt return false for notExistsPath', () => {
    expect(checkFile(notExistsPath)).toBeFalsy()
    expect(checkFile(notExistsPath)).toBe(false)
  })

})

describe('MockTesting class:', () => {


  describe('mock require:', () => {
    let mockTesting: MockTesting;
    mockTesting = new MockTesting;
    let tempFn;
    (function (this: typeof mockTesting) {
      this.requireFake = jest.fn(this.requireFake)
        .mockImplementation(function (q) {
          console.log('backdoorPatcing is working in: ' + q);
        })
    }).call(mockTesting);
    mockTesting.getDataFromSource('mockTesting');
    beforeAll(() => {
    })
    test('toBe', () => {
      expect(mockTesting).toBeDefined()
      expect(mockTesting).toHaveProperty('getDataFromSource')
    })


  })
  describe('mock promise:', () => {
  })
})
