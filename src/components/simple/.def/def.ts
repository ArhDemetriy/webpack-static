import { Destructible } from '../../type'

class Def implements Destructible {
  private readonly ElN: string // `.${this.ElN}-mod`
  private readonly selfElement: HTMLElement
  private readonly active: HTMLElement

  private readonly bindedAction = this.action.bind(this);
  constructor(mainElement: HTMLElement, mainClass: string = 'def') {
    this.ElN = mainClass
    // проверки на корретность компонента
    let temp = mainElement.querySelector(`.${this.ElN}__active`) as HTMLElement
    if (!temp) throw new ReferenceError(`not elem ".${this.ElN}__active" in tag: ${mainElement.tagName} class: ${mainElement.classList.toString}`)
    this.active = temp

    this.selfElement = mainElement

    // навешивание слушателей
    this.active.addEventListener('click', this.bindedAction)
  }
  private action(this: HTMLElement, ev: Event){}
  destroy() {
    this.active.removeEventListener('click', this.bindedAction)
  }
}

export {
  Def,
}
