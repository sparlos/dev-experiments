import * as BABYLON from 'babylonjs'
import BaseFirstPersonScene from '../shared/babylon/BaseFirstPersonScene'
import GUIDialog from '../shared/babylon/GUI/GUIDialog'
import SphereMan from '../shared/babylon/interactables/SphereMan'

import './firstSimulation.scss'
import '../shared/babylon/GUI/guiDialog.scss'

const guiDialog = new GUIDialog()
const firstPersonScene = await BaseFirstPersonScene.initialize()

firstPersonScene.addInteractable(
  new SphereMan(
    firstPersonScene.scene,
    'sphereMan',
    new BABYLON.Vector3(0, 1, 0),
    () => {
      // TODO: will need to trigger dialog system
      guiDialog.isActive = true
      firstPersonScene.disableControls()
    }
  )
)

firstPersonScene.addInteractable(
  new SphereMan(
    firstPersonScene.scene,
    'sphereManTwo',
    new BABYLON.Vector3(5, 1, 5),
    () => {
      // TODO: will need to trigger dialog system
      alert('hello idiot I am sphere 2')
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
