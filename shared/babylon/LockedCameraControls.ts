import * as BABYLON from 'babylonjs'

export default class LockedCameraControls<TCamera extends BABYLON.FreeCamera>
  implements BABYLON.ICameraInput<TCamera>
{
  camera: TCamera
  canvas: HTMLCanvasElement
  _x: number = 0
  _z: number = 0
  sensitivity = 300
  updatePositionHandler: (e: MouseEvent) => void
  lockChangeAlertHandler: () => void
  requestPointerLockHandler: () => void

  constructor(_canvas: HTMLCanvasElement) {
    this.canvas = _canvas
  }

  updatePosition(e: MouseEvent) {
    this.camera.rotation.y += e.movementX ? e.movementX / this.sensitivity : 0
    this.camera.rotation.x += e.movementY ? e.movementY / this.sensitivity : 0
  }

  lockChangeAlert() {
    if (document.pointerLockElement === this.canvas) {
      this.updatePositionHandler = this.updatePosition.bind(this)

      document.addEventListener('mousemove', this.updatePositionHandler, false)
    } else {
      document.removeEventListener(
        'mousemove',
        this.updatePositionHandler,
        false
      )
    }
  }

  async requestPointerLock() {
    if (!document.pointerLockElement) {
      await this.canvas.requestPointerLock()
    }
  }

  attachControl(noPreventDefault?: boolean | undefined): void {
    this.lockChangeAlertHandler = this.lockChangeAlert.bind(this)
    this.requestPointerLockHandler = this.requestPointerLock.bind(this)

    document.addEventListener(
      'pointerlockchange',
      this.lockChangeAlertHandler,
      false
    )
    this.canvas.addEventListener('click', this.requestPointerLockHandler, false)
  }

  detachControl() {
    document.removeEventListener(
      'pointerlockchange',
      this.lockChangeAlertHandler,
      false
    )
    this.canvas.removeEventListener(
      'click',
      this.requestPointerLockHandler,
      false
    )
  }

  getClassName(): string {
    return 'LockedCameraControls'
  }

  getSimpleName(): string {
    return 'lockedCamera'
  }
}
