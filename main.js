import { camera } from '@/entry'
import { ClickHandler } from '@/effect/ClickHandler.js'
import '@/menu.js'
// import { EventBus } from './src/effect/EventBus'
ClickHandler.getInstance().init(camera)
// EventBus.getInstance().on('getPrice', (n, m) => {
//   console.log(n + m)
// })
// EventBus.getInstance().emit('getPrice', 3, 6)