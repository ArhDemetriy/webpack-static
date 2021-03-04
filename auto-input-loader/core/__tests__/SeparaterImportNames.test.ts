import { SeparaterImportNames } from '../SeparaterImportNames'
import { SeparaterImportNamesTestDate } from './SeparaterImportNames.Test.date'
import { promises as fsPromises } from 'fs'
jest.mock('fs')

// ;(require as unknown as jest.MockInstance<Promise<void>, [string, number]>).mockImplementation(function (absolutePath, fsConstant) {
// return Promise.resolve()
// })
// ;(fsPromises.access as unknown as jest.MockInstance<Promise<void>, [string, number]>).mockImplementation(function (absolutePath, fsConstant) {
// return Promise.resolve()
// })




