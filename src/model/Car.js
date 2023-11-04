import * as THREE from 'three'
import gsap from 'gsap'
import { MySprite } from '@/model/MySprite.js'
import { ClickHandler } from '@/effect/ClickHandler'
import { EventBus } from '@/effect/EventBus'

export class Car {
  constructor(model, scene, camera, controls) {
    this.model = model
    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.carModel = {
      'body': {
        'main': { // 车身
          name: 'Object_103',
          model: {} // 小物体对象
        },
        'roof': { // 车顶
          name: 'Object_110',
          model: {}
        },
        'leftDoor': { // 左车门
          name: 'Object_64',
          model: {},
          mark: [
            {
              name: 'sprite',
              url: 'image/sprite.png',
              scale: [0.2, 0.2],
              position: [1.07, 1.94, -0.23] // 参考车门的原点相对位移
            }
          ]
        },
        'rightDoor': { // 右车门
          name: 'Object_77',
          model: {},
          mark: [
            {
              name: 'sprite',
              url: 'image/sprite.png',
              scale: [0.2, 0.2],
              position: [-1.05, 0.78, -0.23]
            }
          ]
        },
        perLun: {
          name: 'Object_21',
        },
        nextLun: {
          name: 'Object_10',
        },
        topLine: {
          name: 'Object_111',
        }
      },
      'glass': { // 玻璃
        'front': { // 前玻璃
          name: 'Object_90',
          model: {}
        },
        'leftGlass': { // 左玻璃
          name: 'Object_68',
          model: {}
        },
        'rightGlass': { // 右玻璃
          name: 'Object_81',
          model: {}
        }
      }
    }
    // 车数值相关（记录用于发给后台-保存用户要购车相关信息）
    this.info = {
      allPrice: 2444700, // 车整体默认总价
      color: [
        {
          name: '土豪金',
          color: '#ff9900',
          isSelected: true
        },
        {
          name: '传奇黑',
          color: '#343a40',
          isSelected: false
        },
        {
          name: '海蓝',
          color: '#409EFF',
          isSelected: false
        },
        {
          name: '玫瑰紫',
          color: '#6600ff',
          isSelected: false
        },
        {
          name: '银灰色',
          color: '#DCDFE6',
          isSelected: false
        }
      ],
      // 贴膜
      film: [
        {
          name: '高光',
          price: 0,
          isSelected: true
        },
        {
          name: '磨砂',
          price: 20000,
          isSelected: false
        }
      ]
    }
    // 汽车各种视角坐标对象
    this.positionObj = {
      // 主驾驶
      main: {
        camera: {
          x: 0.36,
          y: 0.96,
          z: -0.16
        },
        controls: {
          x: 0.36,
          y: 0.87,
          z: 0.03
        }
      },
      // 副驾驶位
      copilot: {
        camera: {
          x: -0.39,
          y: 0.87,
          z: 0.07
        },
        controls: {
          x: -0.39,
          y: 0.85,
          z: 0.13
        }
      },
      // 外面观察
      outside: {
        camera: {
          x: 3,
          y: 1.5,
          z: 3
        },
        controls: {
          x: 0,
          y: 0,
          z: 0
        }
      },

    }
    this.init()
  }
  init () {
    this.scene.add(this.model)
    this.model.traverse(obj => {
      obj.castShadow = true
    })
    Object.values(this.carModel.body).forEach(obj => {
      // 通过名字找到小物体
      obj.model = this.model.getObjectByName(obj.name)
    })
    // 玻璃
    Object.values(this.carModel.glass).forEach(objcc => {
      // 通过名字找到小物体
      objcc.model = this.model.getObjectByName(objcc.name)
    })
    this.modifyCarBody()
    this.createDoorSprite()
    // 车衣颜色
    EventBus.getInstance().on('changeCarColor', (colorStr) => {
      Object.values(this.carModel.body).forEach(obj => {
        obj.model.material.color = new THREE.Color(colorStr)
      })
      this.info.color.forEach(obj => {
        obj.isSelected = false
        if (obj.color === colorStr) {
          obj.isSelected = true
        }
      })
    })
    // 车膜
    EventBus.getInstance().on('changeCarCoat', (coatName) => {
      if (coatName === '高光') {
        Object.values(this.carModel.body).forEach(obj => {
          obj.model.material.roughness = 0.5
          obj.model.material.metalness = 1
          obj.model.material.clearcoat = 1
        })
      } else if (coatName === '磨砂') {
        Object.values(this.carModel.body).forEach(obj => {
          obj.model.material.roughness = 1
          obj.model.material.metalness = 0.5
          obj.model.material.clearcoat = 0
        })
      }
      Object.values(this.info.film).forEach(obj => {
        obj.isSelected = false
        if (obj.name === coatName) obj.isSelected = true
        // 为后面计算总价做准备
      })
    })
    // 总价格
    EventBus.getInstance().on('changeCarPrice', () => {
      this.info.film.forEach(m => {
        if (m.isSelected) {
          let cellPrice = this.info.allPrice + m.price
          let priceDom = document.querySelector('.price>span')
          priceDom.innerHTML = `¥ ${cellPrice.toFixed(2)}`
        }
      })
    })
    // 视角切换
    // 订阅视角切换事件
    EventBus.getInstance().on('changeCarAngleView', viewName => {
      this.setCameraAnimation(this.positionObj[viewName])
    })
  }
  modifyCarBody () {
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      // color: 0xff9900,
      roughness: 0.5,
      metalness: 1,
      clearcoat: 1,
      clearcoatRoughnessMap: 0
    })
    Object.values(this.carModel.body).forEach(obj => {
      // 通过名字找到小物体
      obj.model.material = bodyMaterial
    })
    // 改变玻璃渲染面
    Object.values(this.carModel.glass).forEach(obj => {
      obj.model.material.side = THREE.FrontSide // 前面渲染
    })
    // 车顶部两面渲染
    this.carModel.body.roof.model.material.side = THREE.DoubleSide
  }
  createDoorSprite () {
    let markList = [this.carModel.body.leftDoor, this.carModel.body.rightDoor]
    markList.forEach(m => {
      m.mark.forEach(n => {
        if (n.name === 'sprite') {
          let mySpriteObj = new MySprite(n)
          m.model.add(mySpriteObj)
          // 绑定事件
          ClickHandler.getInstance().addMesh(mySpriteObj, (clickThreeObj) => {
            // clickThreeObj: 精灵物体
            // clickThreeObj.parent: Object_77 车门物体 （坐标轴原点在世界坐标系中心，旋转车门有问题）
            // clickThreeObj.parent.parent.parent （才是整个车门的最大物体对象，坐标系在车门框点固定住-旋转）
            const targetDoor = clickThreeObj.parent.parent.parent
            if (!targetDoor.userData.isOpen) {
              // 没开门 => 开门
              this.setDoorAnimation(targetDoor, { x: Math.PI / 3 })
              targetDoor.userData.isOpen = true
            } else {
              // 已开门 => 关门
              this.setDoorAnimation(targetDoor, { x: 0 })
              targetDoor.userData.isOpen = false
            }
          })
        }
      })
    })
  }
  // 车门动画
  setDoorAnimation (mesh, obj) {
    gsap.to(mesh.rotation, {
      x: obj.x,
      duration: 1,
      ease: 'power1.in'
    })
  }
  // 摄像机和轨道控制器动画
  setCameraAnimation (dataObj) {
    gsap.to(this.camera.position, {
      ...dataObj.camera,
      duration: 1,
      ease: 'power1.in'
    })
    gsap.to(this.controls.target, {
      ...dataObj.controls,
      duration: 1,
      ease: 'power1.in'
    })
  }
}