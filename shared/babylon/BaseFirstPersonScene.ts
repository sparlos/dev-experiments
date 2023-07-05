import * as BABYLON from 'babylonjs'
import LockedCameraControls from './LockedCameraControls'
import InputManager from './InputManager'
import HavokPhysics, { HavokPhysicsWithBindings } from '@babylonjs/havok'

class Player {
  playerCollider: BABYLON.PhysicsAggregate
  camera: BABYLON.FreeCamera
  _scene: BABYLON.Scene
  _canvas: HTMLCanvasElement

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
    this._scene = scene
    this._canvas = canvas

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
}

export default class BaseFirstPersonScene {
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  canvas: HTMLCanvasElement
  light: BABYLON.HemisphericLight
  ground: BABYLON.PhysicsAggregate
  player: Player
  inputManager: InputManager

  constructor(havokInstance: HavokPhysicsWithBindings) {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.engine = new BABYLON.Engine(this.canvas, true)
    this.scene = new BABYLON.Scene(this.engine)

    const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance)
    this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin)
    this.light = this._createLight()
    this.ground = this._createGround()
    this.player = new Player(this.scene, this.canvas)
    this.inputManager = new InputManager(
      this.player.camera,
      this.player.playerCollider
    )
  }

  private _createGround() {
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 30, height: 30 },
      this.scene
    )
    return new BABYLON.PhysicsAggregate(
      ground,
      BABYLON.PhysicsShapeType.BOX,
      { mass: 0 },
      this.scene
    )
  }

  private _createLight() {
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    )
    light.intensity = 0.5
    return light
  }

  static async initialize() {
    const havokInstance = await HavokPhysics()
    return new BaseFirstPersonScene(havokInstance)
  }
}
