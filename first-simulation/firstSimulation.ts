import * as BABYLON from 'babylonjs'
import BaseFirstPersonScene from '../shared/babylon/BaseFirstPersonScene'
import './firstSimulation.scss'
import SphereMan from '../shared/babylon/SphereMan'

const firstPersonScene = await BaseFirstPersonScene.initialize()

firstPersonScene.addInteractable(
  new SphereMan(
    firstPersonScene.scene,
    'sphereMan',
    new BABYLON.Vector3(0, 1, 0),
    () => {
      // TODO: will need to trigger dialog system
      alert('hello idiot')
    }
  )
)

firstPersonScene.engine.runRenderLoop(function () {
  firstPersonScene.scene.render()
  firstPersonScene.inputManager.checkInputs()
  firstPersonScene.player.checkInteractables()
})

window.addEventListener('resize', function () {
  firstPersonScene.engine.resize()
})
