// 初始化 three.js 基础环境
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { loadManager } from '@/model/loadManager.js'
import { Car } from '@/model/Car.js'
import { MyLight } from '@/effect/MyLight.js'
import { Sky } from '@/effect/Sky.js'
export let scene, camera, renderer, controls
// 这次 app 标签作为 three.js 的画布容器
const app = document.querySelector('.app')

function init () {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, app.clientWidth / app.clientHeight, 0.1, 1000)
  camera.position.set(3, 1.5, 3)
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.setSize(app.clientWidth, app.clientHeight)
  document.querySelector('.app').appendChild(renderer.domElement)

  loadManager('glb/Lamborghini.glb', (model) => {
    new Car(model, scene, camera, controls)
    new MyLight(scene)
    new Sky(scene)
  })
}

function createControls () {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
}

function createHelper () {
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
}

function resizeRender () {
  window.addEventListener('resize', () => {
    renderer.setSize(app.clientWidth, app.clientHeight)
    camera.aspect = app.clientWidth / app.clientHeight
    camera.updateProjectionMatrix()
  })
}

function renderLoop () {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(renderLoop)
}

function start () {
  init()
  createControls()
  createHelper()
  resizeRender()
  renderLoop()
}

start()
