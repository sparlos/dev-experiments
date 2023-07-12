import Interactable from '../types/Interactable'
import {
  PhysicsAggregate,
  Scene,
  Vector3,
  SceneLoader,
  Tools,
  PhysicsShapeType,
} from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

export default class SphereMan implements Interactable {
  aggregate: PhysicsAggregate
  name: string
  callback: () => void

  // TODO: figure out how to strongly type
  // the constructor signature in the Interactable interface
  constructor(
    scene: Scene,
    name: string,
    defaultPosition: Vector3,
    callback: () => void
  ) {
    this.name = name
    this.callback = callback

    SceneLoader.ImportMesh(
      'Sphere',
      '/assets/first-simulation/',
      'sphereman.gltf',
      scene,
      (meshes) => {
        const sphere = meshes[1]
        sphere.position = defaultPosition
        sphere.rotation = new Vector3(0, Tools.ToRadians(115), 0)
        sphere.name = name

        sphere.position = defaultPosition

        const sphereAggregate = new PhysicsAggregate(
          sphere,
          PhysicsShapeType.SPHERE,
          { mass: 0 },
          scene
        )

        sphereAggregate.shape.filterMembershipMask = 1
      }
    )
  }
}
