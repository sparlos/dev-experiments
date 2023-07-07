export interface Dialog {
  dialog: string[]
  getDialog(): string
  setDialog(dialog: string[]): void
}

export default class GUIDialog {
  overlayElement: HTMLDivElement
  private _isActive: boolean = false

  constructor() {
    this.overlayElement = document.createElement('div')
    this.overlayElement.classList.add('dialog-overlay')
    document.body.appendChild(this.overlayElement)
  }

  get isActive(): boolean {
    return this._isActive
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive
    if (isActive) {
      this.overlayElement.classList.add('dialog-overlay--active')
    } else {
      this.overlayElement.classList.remove('dialog-overlay--active')
    }
  }
}
