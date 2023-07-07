export default class GUIDialog {
  overlayElement: HTMLDivElement
  _isActive: boolean = false
  currentDialogIndex: number = 0
  dialog: string[] = []
  deactivateCallback: () => void
  onClickHandler: (e: MouseEvent) => void

  constructor() {
    this.overlayElement = document.createElement('div')
    this.overlayElement.classList.add('dialog-overlay')
    document.body.appendChild(this.overlayElement)
  }

  get isActive(): boolean {
    return this._isActive
  }

  set isActive(isActive: boolean) {
    throw new Error(
      'cannot set isActive directly, use activate/deactivate method instead'
    )
  }

  private _deactivate() {
    this._isActive = false
    this.overlayElement.innerHTML = ''
    this.overlayElement.classList.remove('dialog-overlay--active')
    this.deactivateCallback()
    document.removeEventListener('click', this.onClickHandler)
  }

  activate(dialog: string[], deactivateCallback: () => void): void {
    this.dialog = dialog
    this.currentDialogIndex = 0
    this._isActive = true
    this.overlayElement.innerHTML = this.dialog[this.currentDialogIndex]
    this.overlayElement.classList.add('dialog-overlay--active')
    this.deactivateCallback = deactivateCallback

    this.onClickHandler = this._handleClick.bind(this)
    document.addEventListener('click', this.onClickHandler)
  }

  _handleClick(): void {
    this.nextDialog()
  }

  nextDialog(): void {
    if (this.currentDialogIndex < this.dialog.length - 1) {
      this.currentDialogIndex++
      this.overlayElement.innerHTML = this.dialog[this.currentDialogIndex]
    } else {
      this._deactivate()
    }
  }
}
