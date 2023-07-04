import * as BABYLON from 'babylonjs'

export default class InputManager {
  _camera: BABYLON.FreeCamera
  _playerCollider: BABYLON.PhysicsAggregate
  _isMovingLeft: boolean = false
  _isMovingRight: boolean = false
  _isMovingForward: boolean = false
  _isMovingBackward: boolean = false

  constructor(
    camera: BABYLON.FreeCamera,
    playerCollider: BABYLON.PhysicsAggregate
  ) {
    this._registerKeyboardControls()
    this._camera = camera
    this._playerCollider = playerCollider
  }

  private _handleKeyDown(e: KeyboardEvent) {
    const map = {
      KeyW: () => {
        this._isMovingForward = true
      },
      KeyS: () => {
        this._isMovingBackward = true
      },
      KeyA: () => {
        this._isMovingLeft = true
      },
      KeyD: () => {
        this._isMovingRight = true
      },
    }

    const handler = map[e.code]
    handler && handler()
  }

  private _handleKeyUp(e: KeyboardEvent) {
    const map = {
      KeyW: () => {
        this._isMovingForward = false
      },
      KeyS: () => {
        this._isMovingBackward = false
      },
      KeyA: () => {
        this._isMovingLeft = false
      },
      KeyD: () => {
        this._isMovingRight = false
      },
    }

    const handler = map[e.code]
    handler && handler()
  }

  private _registerKeyboardControls() {
    document.addEventListener('keydown', this._handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this._handleKeyUp.bind(this), false)
  }

  checkInputs() {
    const speed = 10
    let x = 0
    let z = 0

    if (this._isMovingForward) {
      z += speed
    }
    if (this._isMovingBackward) {
      z -= speed
    }
    if (this._isMovingLeft) {
      x -= speed
    }
    if (this._isMovingRight) {
      x += speed
    }

    const zAxisDirection = this._camera.getDirection(BABYLON.Axis.Z).scale(z)

    const xAxisDirection = this._camera.getDirection(BABYLON.Axis.X).scale(x)

    const zVelocity = zAxisDirection.z + xAxisDirection.z
    const xVelocity = zAxisDirection.x + xAxisDirection.x

    this._playerCollider.body.setLinearVelocity(
      new BABYLON.Vector3(xVelocity, -9.81, zVelocity)
    )
  }
}
