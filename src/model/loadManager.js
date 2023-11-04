import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
/**
 * 
 * @param {*} params 
 */
export function loadManager (path, successFn) {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(path, gltf => successFn(gltf.scene), process => {
    // console.log(process)
  }, error => {
    throw new Error(error)
  })
}