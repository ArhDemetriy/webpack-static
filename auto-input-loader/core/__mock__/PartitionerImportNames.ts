import { mockedClass } from '../../../utils/mockingClass'
import { PartitionerImportNames } from '../PartitionerImportNames'
import { PartitionerImportNamesTestDate } from './PartitionerImportNames.test.date'

let dataForPartitioner = new PartitionerImportNamesTestDate();

{const implementations:[string, (...args: any[]) => any][] =[
  ['getImportsFrom', function (s: string) {
    if (!dataForPartitioner.requireMock.has(s))
      throw new Error('MOCK file not founded');
    return dataForPartitioner.requireMock.get(s)
  }],
  ['checkExistsPromise',function (s: string) {
    if (dataForPartitioner.fsMock.has(s))
      return Promise.resolve()
    else
      return Promise.reject()
  }],
]
mockedClass(PartitionerImportNames, new Map(implementations));
}

export {
  PartitionerImportNames,
}
