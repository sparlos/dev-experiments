import BaseFirstPersonScene from '../BaseFirstPersonScene'

export default class Reticle {
  reticleElement: HTMLElement
  currentText: string

  constructor() {
    this.reticleElement = document.createElement('div')
    this.currentText = '.'
    this.reticleElement.innerText = this.currentText
    this.reticleElement.id = 'reticle'
    document.body.appendChild(this.reticleElement)
  }

  update(firstPersonScene: BaseFirstPersonScene) {
    const canPlayerInteract = firstPersonScene.canPlayerInteract()
    const canPlayerMove = firstPersonScene.inputManager.canMove

    const newText =
      canPlayerInteract && canPlayerMove ? 'Press E to interact' : '.'
    if (this.currentText !== newText) {
      this.currentText = newText
      this.reticleElement.innerText = this.currentText
    }
  }
}
