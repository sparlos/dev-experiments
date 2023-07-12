import {
  Engine,
  Scene,
  HemisphericLight,
  PhysicsAggregate,
  HavokPlugin,
  Vector3,
  MeshBuilder,
  PhysicsShapeType,
} from '@babylonjs/core'
import InputManager from './InputManager'
import Player from './Player'
import HavokPhysics, { HavokPhysicsWithBindings } from '@babylonjs/havok'
import Interactable, { InteractableMap } from './types/Interactable'

export default class BaseFirstPersonScene {
  engine: Engine
  scene: Scene
  canvas: HTMLCanvasElement
  light: HemisphericLight
  ground: PhysicsAggregate
  player: Player
  inputManager: InputManager
  physicsEngine: HavokPlugin
  interactableMap: InteractableMap = {}

  constructor(havokInstance: HavokPhysicsWithBindings) {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.engine = new Engine(this.canvas, true)
    this.scene = new Scene(this.engine)
    // enable debug
    // this.scene.debugLayer.show()

    const havokPlugin = new HavokPlugin(true, havokInstance)
    this.physicsEngine = havokPlugin
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin)
    this.light = this._createLight()
    this.ground = this._createGround()
    this.ground.shape.filterMembershipMask = 2
    this.player = new Player(
      this.scene,
      this.canvas,
      this.physicsEngine,
      this.interactableMap
    )
    this.inputManager = new InputManager(this.player)
  }

  update() {
    this.scene.render()
    this.inputManager.checkInputs()
    this.player.checkInteractables()
  }

  addInteractable(interactable: Interactable) {
    this.interactableMap[interactable.name] = interactable
  }

  disableControls() {
    this.inputManager.canMove = false
    this.player.camera.inputs.attached.lockedCamera.detachControl()
  }

  enableControls() {
    this.inputManager.canMove = true
    this.player.camera.inputs.attachInput(
      this.player.camera.inputs.attached.lockedCamera
    )
  }

  canPlayerInteract() {
    return !!this.player.currentInteractableCallback
  }

  private _createGround() {
    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: 30, height: 30 },
      this.scene
    )
    return new PhysicsAggregate(
      ground,
      PhysicsShapeType.BOX,
      { mass: 0 },
      this.scene
    )
  }

  private _createLight() {
    const light = new HemisphericLight(
      'light',
      new Vector3(0, 1, 0),
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
