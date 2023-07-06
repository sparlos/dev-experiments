import * as BABYLON from 'babylonjs'
import LockedCameraControls from './LockedCameraControls'
import { InteractableMap } from './types/Interactable'

export default class Player {
  playerCollider: BABYLON.PhysicsAggregate
  camera: BABYLON.FreeCamera
  _scene: BABYLON.Scene
  _canvas: HTMLCanvasElement
  _physicsEngine: BABYLON.HavokPlugin
  _raycastResult: BABYLON.PhysicsRaycastResult =
    new BABYLON.PhysicsRaycastResult()
  _interactableMap: InteractableMap
  currentInteractableCallback?: () => void

  constructor(
    scene: BABYLON.Scene,
    canvas: HTMLCanvasElement,
    physicsEngine: BABYLON.HavokPlugin,
    interactableMap: InteractableMap
  ) {
    this._scene = scene
    this._canvas = canvas
    this._physicsEngine = physicsEngine
    this._interactableMap = interactableMap

    this.camera = this._createCamera()
    this.playerCollider = this._createPlayerCollider(this.camera)
  }

  _createCamera() {
    const camera = new BABYLON.FreeCamera(
      'playerCamera',
      new BABYLON.Vector3(0, 0, 0),
      this._scene
    )
    camera.inputs.clear()
    camera.inputs.add(
      new LockedCameraControls<BABYLON.FreeCamera>(this._canvas)
    )

    camera.attachControl(this._canvas, true)
    return camera
  }

  _createPlayerCollider(camera: BABYLON.FreeCamera) {
    const capsule = BABYLON.MeshBuilder.CreateCapsule(
      'playerCapsule',
      { radius: 1.25, height: 2.25 },
      this._scene
    )
    capsule.position = new BABYLON.Vector3(0, 1, -10)
    capsule.isVisible = false
    const capsuleAggregate = new BABYLON.PhysicsAggregate(
      capsule,
      BABYLON.PhysicsShapeType.CAPSULE,
      { mass: 1, friction: 1000, restitution: 0 },
      this._scene
    )
    capsule.isVisible = false

    capsuleAggregate.body.setMassProperties({
      mass: 1,
      inertia: new BABYLON.Vector3(0, 0, 0),
    })

    this.camera.parent = capsule

    return capsuleAggregate
  }

  checkInteractables() {
    const start = this.playerCollider.transformNode.position
    const end = start.add(this.camera.getForwardRay().direction.scale(5))

    this._physicsEngine.raycast(start, end, this._raycastResult, {
      collideWith: 1,
    })
    const interactableName = this._raycastResult.body?.transformNode.name || ''
    this.currentInteractableCallback = interactableName
      ? this._interactableMap[interactableName]?.callback
      : undefined
  }
}
