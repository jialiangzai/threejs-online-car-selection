import * as THREE from 'three'
import { EventBus } from '@/effect/EventBus'

/**
 * 
 */
export class Sky {
  constructor(scene) {
    this.scene = scene
    this.nowMesh = []
    this.nowSkyName = '展厅'
    this.init()
  }
  init () {
    this.createInDoor()
    EventBus.getInstance().on('changeSky', (skyName) => {
      if (skyName === this.nowSkyName) return // 防止用户反复点击同一个场景创建无用的东西
      this.clear() // 清除当前物体
      if (skyName === '展厅') {
        this.createInDoor()
        this.nowSkyName = '展厅'
      } else if (skyName === '户外') {
        this.createOutDoor()
        this.nowSkyName = '户外'
      }
    })
  }
  createInDoor () {
    // 室内
    const geometry = new THREE.SphereGeometry(15, 60, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0x42454c, side: THREE.DoubleSide })
    const sphere = new THREE.Mesh(geometry, material)
    this.scene.add(sphere)
    this.nowMesh.push(sphere)
    // 地面
    const plane = new THREE.CircleGeometry(10, 60)
    const materialPlan = new THREE.MeshStandardMaterial({ color: 0x42454c, side: THREE.DoubleSide })
    const circle = new THREE.Mesh(plane, materialPlan)
    circle.rotation.set(-Math.PI / 2, 0, 0)
    circle.receiveShadow = true
    this.scene.add(circle)
    this.nowMesh.push(circle)
  }
  // 户外
  createOutDoor () {
    // 让球体大一些
    // 球体
    const sphereGeo = new THREE.SphereGeometry(40, 32, 16)
    const sphereTexture = (new THREE.TextureLoader()).load('image/desert.jpg') // 户外 720 度全景图片-得到纹理对象
    sphereTexture.colorSpace = THREE.SRGBColorSpace
    const material = new THREE.MeshBasicMaterial({ map: sphereTexture, side: THREE.DoubleSide })
    const sphere = new THREE.Mesh(sphereGeo, material)
    this.scene.add(sphere)
    this.nowMesh.push(sphere)

    // 地面
    const planeGeo = new THREE.CircleGeometry(20, 32)
    const planeTexture = (new THREE.TextureLoader()).load('image/sand.jpg') // 地面纹理对象
    const standardMaterial = new THREE.MeshStandardMaterial({ map: planeTexture, color: 0xa0825a, side: THREE.DoubleSide }) // 颜色和颜色贴图可以混合计算
    const plane = new THREE.Mesh(planeGeo, standardMaterial)
    plane.rotation.set(- Math.PI / 2, 0, 0)
    this.scene.add(plane)
    this.nowMesh.push(plane)
  }
  // 清除球体和地面
  clear () {
    this.nowMesh.forEach(obj => {
      obj.geometry.dispose()
      obj.material.dispose()
      obj.material.map && obj.material.map.dispose() // 纹理对象释放内存

      obj.parent.remove(obj)
    })

    this.nowMesh.splice(0, this.nowMesh.length) // 清空数组
  }
}