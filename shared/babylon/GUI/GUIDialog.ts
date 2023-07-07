export default class GUIDialog {
  overlayElement: HTMLDivElement
  dialogTextElement: HTMLDivElement
  _isActive: boolean = false
  currentDialogIndex: number = 0
  dialog: string[] = []
  deactivateCallback: () => void
  onClickHandler: (e: MouseEvent) => void

  constructor() {
    this.overlayElement = document.createElement('div')
    this.overlayElement.classList.add('dialog-overlay')
    document.body.appendChild(this.overlayElement)
    this._createContinueText()
    this._createDialogText()
  }

  _createDialogText() {
    this.dialogTextElement = document.createElement('div')
    this.dialogTextElement.classList.add('dialog-overlay__dialog-text')
    this.overlayElement.appendChild(this.dialogTextElement)
  }

  _createContinueText() {
    const continueText = document.createElement('div')
    continueText.classList.add('dialog-overlay__continue-text')
    continueText.innerText = 'Click to continue'
    this.overlayElement.appendChild(continueText)
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
    this.dialogTextElement.innerText = ''
    this.overlayElement.classList.remove('dialog-overlay--active')
    this.deactivateCallback()
    document.removeEventListener('click', this.onClickHandler)
  }

  activate(dialog: string[], deactivateCallback: () => void): void {
    this.dialog = dialog
    this.currentDialogIndex = 0
    this._isActive = true
    this.dialogTextElement.innerText = this.dialog[this.currentDialogIndex]
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
      this.dialogTextElement.innerText = this.dialog[this.currentDialogIndex]
    } else {
      this._deactivate()
    }
  }
}
