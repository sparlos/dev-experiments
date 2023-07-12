import { PhysicsAggregate } from '@babylonjs/core'

export interface InteractableMap {
  [key: string]: Interactable
}

export default interface Interactable {
  aggregate: PhysicsAggregate
  name: string
  callback: () => void
}
