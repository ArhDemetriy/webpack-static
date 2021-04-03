import { ParserResolves } from '../ParserResolves'
import { PartitionImports } from './PartitionImports'
import { mockedClass } from '../../../utils/mockingClass'
// jest.mock('./PartitionImports')
// jest.mock('./ParserResolves')

mockedClass(ParserResolves, new Map([
  ['init', function (this: ParserResolves, q) {
    this.partitioner = new PartitionImports(q)
  }],
]))

export {
  ParserResolves,
}
