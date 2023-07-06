import * as BABYLON from 'babylonjs'

export default interface Interactable {
  aggregate: BABYLON.PhysicsAggregate
  name: string
  callback: () => void
}
