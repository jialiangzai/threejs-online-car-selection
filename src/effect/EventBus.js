import * as THREE from 'three'
/**
 * 集中式事件处理机制，是订阅与发布模式的一种实现
 * 封装事件总线类，管理跨模块通信
 */
export class EventBus {
  constructor() {
    this.eventObj = {} // 保存事件名和要触发的函数体们(多个)
  }
  static getInstance () {
    if (!this.instance) {
      this.instance = new EventBus()
    }
    return this.instance
  }
  //事件名 回调 订阅
  on (eventName, fn) {
    if (!this.eventObj[eventName]) {
      this.eventObj[eventName] = []
    }
    this.eventObj[eventName].push(fn)
  }
  // 发布
  emit (eventName, ...arg) {
    // arg 此变量是一个数组（值就是按照先后顺序传入的实参）
    this.eventObj[eventName].forEach(fn => {
      fn(...arg) // 展开参数数组，按顺序一个个传递给回调函数
    })
  }
}