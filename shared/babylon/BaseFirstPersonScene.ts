import * as BABYLON from 'babylonjs'
import InputManager from './InputManager'
import Player from './Player'
import HavokPhysics, { HavokPhysicsWithBindings } from '@babylonjs/havok'
import Interactable, { InteractableMap } from './types/Interactable'

export default class BaseFirstPersonScene {
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  canvas: HTMLCanvasElement
  light: BABYLON.HemisphericLight
  ground: BABYLON.PhysicsAggregate
  player: Player
  inputManager: InputManager
  physicsEngine: BABYLON.HavokPlugin
  interactableMap: InteractableMap = {}

  constructor(havokInstance: HavokPhysicsWithBindings) {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.engine = new BABYLON.Engine(this.canvas, true)
    this.scene = new BABYLON.Scene(this.engine)
    // enable debug
    // this.scene.debugLayer.show()

    const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance)
    this.physicsEngine = havokPlugin
    this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin)
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

  addInteractable(interactable: Interactable) {
    this.interactableMap[interactable.name] = interactable
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
