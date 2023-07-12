import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
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
    this.callback = callback

    BABYLON.SceneLoader.ImportMesh(
      'Sphere',
      '/assets/first-simulation/',
      'sphereman.gltf',
      scene,
      (meshes) => {
        const sphere = meshes[1]
        sphere.position = defaultPosition
        sphere.rotation = new BABYLON.Vector3(
          0,
          BABYLON.Tools.ToRadians(115),
          0
        )
        sphere.name = name

        sphere.position = defaultPosition

        const sphereAggregate = new BABYLON.PhysicsAggregate(
          sphere,
          BABYLON.PhysicsShapeType.SPHERE,
          { mass: 0 },
          scene
        )

        sphereAggregate.shape.filterMembershipMask = 1
      }
    )
  }
}
