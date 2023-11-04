// 专门产生精灵物体类
import * as THREE from 'three'
export class MySprite {
  constructor({ name, url, position, scale }) {
    const texture = (new THREE.TextureLoader()).load(url)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.position.set(...position)
    sprite.scale.set(...scale)
    sprite.name = name

    // 直接返回精灵物体对象（而非 new 创建的空白对象）
    return sprite
  }
}