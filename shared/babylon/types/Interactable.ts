import * as BABYLON from 'babylonjs'

export interface InteractableMap {
  [key: string]: Interactable
}

export default interface Interactable {
  aggregate: BABYLON.PhysicsAggregate
  name: string
  callback: () => void
}
