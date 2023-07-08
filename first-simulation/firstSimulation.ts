import BaseFirstPersonScene from '../shared/babylon/BaseFirstPersonScene'
import GUIDialog from '../shared/babylon/GUI/GUIDialog'
import { setup as setupSphereMen } from './services/sphereMen'

import './firstSimulation.scss'
import '../shared/babylon/GUI/guiDialog.scss'
import Reticle from '../shared/babylon/GUI/Reticle'

const reticle = new Reticle()
const guiDialog = new GUIDialog()
const firstPersonScene = await BaseFirstPersonScene.initialize()

setupSphereMen(firstPersonScene, guiDialog)

firstPersonScene.engine.runRenderLoop(function () {
  firstPersonScene.scene.render()
  firstPersonScene.inputManager.checkInputs()
  firstPersonScene.player.checkInteractables()
  reticle.update(firstPersonScene)
})

window.addEventListener('resize', function () {
  firstPersonScene.engine.resize()
})
