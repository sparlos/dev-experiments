import {
  Scene,
  PhysicsAggregate,
  HavokPlugin,
  Vector3,
  MeshBuilder,
  PhysicsShapeType,
  FreeCamera,
  PhysicsRaycastResult,
} from '@babylonjs/core'
import LockedCameraControls from './LockedCameraControls'
import { InteractableMap } from './types/Interactable'

export default class Player {
  playerCollider: PhysicsAggregate
  camera: FreeCamera
  _scene: Scene
  _canvas: HTMLCanvasElement
  _physicsEngine: HavokPlugin
  _raycastResult: PhysicsRaycastResult = new PhysicsRaycastResult()
  _interactableMap: InteractableMap
  currentInteractableCallback?: () => void

  constructor(
    scene: Scene,
    canvas: HTMLCanvasElement,
    physicsEngine: HavokPlugin,
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
    const camera = new FreeCamera(
      'playerCamera',
      new Vector3(0, 0, 0),
      this._scene
    )
    camera.inputs.clear()
    camera.inputs.add(new LockedCameraControls<FreeCamera>())

    camera.attachControl(this._canvas, true)
    return camera
  }

  _createPlayerCollider(camera: FreeCamera) {
    const capsule = MeshBuilder.CreateCapsule(
      'playerCapsule',
      { radius: 1.25, height: 2.25 },
      this._scene
    )
    capsule.position = new Vector3(0, 1, -10)
    capsule.isVisible = false
    const capsuleAggregate = new PhysicsAggregate(
      capsule,
      PhysicsShapeType.CAPSULE,
      { mass: 1, friction: 1000, restitution: 0 },
      this._scene
    )
    capsule.isVisible = false

    capsuleAggregate.body.setMassProperties({
      mass: 1,
      inertia: new Vector3(0, 0, 0),
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
    const interactableName = this._raycastResult.hasHit
      ? this._raycastResult.body?.transformNode.name
      : ''
    this.currentInteractableCallback = interactableName
      ? this._interactableMap[interactableName]?.callback
      : undefined
  }
}
