class Def {
  constructor(element: HTMLElement) {
  }
}

const defs: Def[] = []
document.querySelectorAll('.def').forEach(e => defs.push(new Def(e as HTMLElement)))

export { Def }
export default defs
