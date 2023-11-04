import { EventBus } from "./effect/EventBus"

// 汽车菜单 dom事件绑定
let colorArr = document.querySelectorAll('.col_group>div')
colorArr.forEach(el => {
  el.addEventListener('click', (e) => {
    let colorStr = el.dataset.col
    EventBus.getInstance().emit('changeCarColor', colorStr)
  })
})

let coArr = document.querySelectorAll('.coat_group>div')
coArr.forEach(el => {
  el.addEventListener('click', (e) => {
    let coStr = el.dataset.co
    EventBus.getInstance().emit('changeCarCoat', coStr)
    EventBus.getInstance().emit('changeCarPrice')
  })
})
let scenArr = document.querySelectorAll('.scene_group>div')
scenArr.forEach(el => {
  el.addEventListener('click', (e) => {
    let coStr = el.dataset.poi
    EventBus.getInstance().emit('changeSky', coStr)
  })
})
let lookArr = document.querySelectorAll('.look_group>div')
lookArr.forEach(el => {
  el.addEventListener('click', (e) => {
    let coStr = el.dataset.po
    EventBus.getInstance().emit('changeCarAngleView', coStr)
  })
})

