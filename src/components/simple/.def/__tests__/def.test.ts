import { mockModule } from 'jest-mock-implementations-preserving'
import { Def } from '../def'

jest.mock('../def.ts', () => mockModule<{ Def, }>(jest.requireActual('../def.ts'), {
  Def: {

  },
}))
describe('class Def:', function (this: Def) {
  let def: Def
  beforeEach(() => {

  })
  it('should toBe ', () => {
    expect(Def).toBeDefined()
  })
})
