import { Vector3 } from '@babylonjs/core'
import BaseFirstPersonScene from '../../shared/babylon/BaseFirstPersonScene'
import GUIDialog from '../../shared/babylon/GUI/GUIDialog'
import SphereMan from '../../shared/babylon/interactables/SphereMan'

const sphereMenData = [
  {
    name: 'sphere1',
    position: new Vector3(0, 1, 0),
    dialog: ['Hello, I am Sphere Man.', 'Welcome to the office of spheres.'],
  },
  {
    name: 'sphere2',
    position: new Vector3(2, 1, 5),
    dialog: ['I am the second sphere man.', 'You are STUPIDDDD'],
  },
]

export const setup = (scene: BaseFirstPersonScene, guiDialog: GUIDialog) => {
  sphereMenData.forEach((data) => {
    scene.addInteractable(
      new SphereMan(scene.scene, data.name, data.position, () => {
        scene.disableControls()
        guiDialog.activate(data.dialog, () => {
          scene.enableControls()
        })
      })
    )
  })
}
