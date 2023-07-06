import * as BABYLON from 'babylonjs'
import Interactable from '../types/Interactable'

export default class SphereMan implements Interactable {
  aggregate: BABYLON.PhysicsAggregate
  name: string
  callback: () => void

  // TODO: figure out how to strongly type
  // the constructor signature in the Interactable interface
  constructor(
    scene: BABYLON.Scene,
    name: string,
    defaultPosition: BABYLON.Vector3,
    callback: () => void
  ) {
    this.name = name

    const sphere = BABYLON.MeshBuilder.CreateSphere(
      name,
      { diameter: 2 },
      scene
    )

    sphere.position = defaultPosition

    const sphereAggregate = new BABYLON.PhysicsAggregate(
      sphere,
      BABYLON.PhysicsShapeType.SPHERE,
      { mass: 0 },
      scene
    )

    sphereAggregate.shape.filterMembershipMask = 1

    this.callback = callback
  }
}
