import BaseFirstPersonScene from '../shared/babylon/BaseFirstPersonScene'
import './firstSimulation.scss'

const firstPersonScene = await BaseFirstPersonScene.initialize()

firstPersonScene.engine.runRenderLoop(function () {
  firstPersonScene.scene.render()
  firstPersonScene.inputManager.checkInputs()
})

window.addEventListener('resize', function () {
  firstPersonScene.engine.resize()
})
