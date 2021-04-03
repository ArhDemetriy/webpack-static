import { mockedClass } from '../../../utils/mockingClass'
import { PartitionImports } from '../PartitionImports'
import { PartitionImportsTestDate } from './PartitionImports.test.date'

let dataForPartitioner = new PartitionImportsTestDate();

{const implementations:[string, (...args: any[]) => any][] =[
  ['getImportsFrom', function (s: string) {
    // console.log(s);

    if (!dataForPartitioner.requireMock.has(s))
      throw new Error(`MOCK file not founded: ${s}\n in: ${[...dataForPartitioner.requireMock.entries()]}`);
    return dataForPartitioner.requireMock.get(s)
  }],
  ['checkExistsPromise', function (s: string) {
    if (dataForPartitioner.fsMock.has(s))
      return Promise.resolve()
    else
      return Promise.reject()
  }],
]
mockedClass(PartitionImports, new Map(implementations));
}

export {
  PartitionImports,
}
