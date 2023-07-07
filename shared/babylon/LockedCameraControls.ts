import * as BABYLON from 'babylonjs'

export default class LockedCameraControls<TCamera extends BABYLON.FreeCamera>
  implements BABYLON.ICameraInput<TCamera>
{
  camera: TCamera
  _x: number = 0
  _z: number = 0
  sensitivity = 300
  updatePositionHandler: (e: MouseEvent) => void
  lockChangeAlertHandler: () => void
  requestPointerLockHandler: () => void

  updatePosition(e: MouseEvent) {
    let newXRotation =
      this.camera.rotation.x +
      (e.movementY ? e.movementY / this.sensitivity : 0)

    if (newXRotation >= Math.PI / 2) {
      newXRotation = Math.PI / 2
    } else if (newXRotation <= -Math.PI / 2) {
      newXRotation = -Math.PI / 2
    }

    this.camera.rotation.y += e.movementX ? e.movementX / this.sensitivity : 0
    this.camera.rotation.x = newXRotation
  }

  lockChangeAlert() {
    if (document.pointerLockElement === document.body) {
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
      await document.body.requestPointerLock()
    }
  }

  attachControl(noPreventDefault?: boolean | undefined): void {
    this.lockChangeAlertHandler = this.lockChangeAlert.bind(this)
    this.requestPointerLockHandler = this.requestPointerLock.bind(this)

    if (document.pointerLockElement === document.body) {
      this.updatePositionHandler = this.updatePosition.bind(this)

      document.addEventListener('mousemove', this.updatePositionHandler, false)
    }

    document.addEventListener(
      'pointerlockchange',
      this.lockChangeAlertHandler,
      false
    )
    document.body.addEventListener(
      'click',
      this.requestPointerLockHandler,
      false
    )
  }

  detachControl() {
    document.removeEventListener(
      'pointerlockchange',
      this.lockChangeAlertHandler,
      false
    )
    document.body.removeEventListener(
      'click',
      this.requestPointerLockHandler,
      false
    )
    document.removeEventListener('mousemove', this.updatePositionHandler, false)
  }

  getClassName(): string {
    return 'LockedCameraControls'
  }

  getSimpleName(): string {
    return 'lockedCamera'
  }
}
