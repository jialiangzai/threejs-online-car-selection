// 整个 three.js 项目-单击事件管理类
import * as THREE from 'three'
export class ClickHandler {
  // 初始化实例对象 单例模式 这个类被调用 n 次也只会产生同一个实例对象
  static getInstance () {
    if (!this.instance) {
      this.instance = new ClickHandler()
    }
    return this.instance
  }
  // 准备数据 init传入相机参数 光线投影优化
  // map结构映射
  init (camera) {
    this.list = [] // 光线投射交互计算的物体
    this.camera = camera
    this.map = new Map()
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const app = document.querySelector('.app')
    window.addEventListener('click', (event) => {
      pointer.x = (event.clientX / app.clientWidth) * 2 - 1
      pointer.y = -(event.clientY / app.clientHeight) * 2 + 1
      raycaster.setFromCamera(pointer, this.camera)
      const mlist = raycaster.intersectObjects(this.list)
      mlist.forEach(obj => {
        const fn = this.map.get(obj.object)
        // 回调绑定点击事件函数体，并回传当前触发的这个 three.js 物体
        fn(obj.object)
      })
    })
  }
  // 绑定对应物体对象 回调
  addMesh (mesh, fn) {
    this.list.push(mesh)
    this.map.set(mesh, fn)
  }
}