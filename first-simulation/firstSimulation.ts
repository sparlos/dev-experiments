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
      firstPersonScene.disableControls()
      guiDialog.activate(
        ['Hello, I am Sphere Man.', 'Welcome to the office of spheres.'],
        () => {
          firstPersonScene.enableControls()
        }
      )
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
