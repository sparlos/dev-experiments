import * as BABYLON from 'babylonjs'

export default class LockedCameraControls<TCamera extends BABYLON.FreeCamera>
  implements BABYLON.ICameraInput<TCamera>
{
  camera: TCamera
  canvas: HTMLCanvasElement
  _x: number = 0
  _z: number = 0
  sensitivity = 300

  constructor(_canvas: HTMLCanvasElement) {
    this.canvas = _canvas
  }

  updatePosition(e: MouseEvent) {
    this.camera.rotation.y += e.movementX ? e.movementX / this.sensitivity : 0
    this.camera.rotation.x += e.movementY ? e.movementY / this.sensitivity : 0
  }

  lockChangeAlert() {
    if (document.pointerLockElement === this.canvas) {
      document.addEventListener(
        'mousemove',
        this.updatePosition.bind(this),
        false
      )
    } else {
      console.log('The pointer lock status is now unlocked')
      document.removeEventListener(
        'mousemove',
        this.updatePosition.bind(this),
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
    document.addEventListener(
      'pointerlockchange',
      this.lockChangeAlert.bind(this),
      false
    )
    this.canvas.addEventListener(
      'click',
      this.requestPointerLock.bind(this),
      false
    )
  }

  detachControl() {
    document.removeEventListener(
      'pointerlockchange',
      this.lockChangeAlert,
      false
    )
    this.canvas.removeEventListener(
      'click',
      this.requestPointerLock.bind(this),
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
