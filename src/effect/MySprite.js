import * as THREE from 'three'
/**
 * 名称 位置 缩放 url
 */
export class MySprite {
  constructor(obj) {
    let { name, url, position, scale } = obj
    const material = new THREE.SpriteMaterial({ map: (new THREE.TextureLoader().load(url)) })

    const sprite = new THREE.Sprite(material)
    sprite.position.set(...position)
    sprite.scale.set(...scale)
    sprite.name = name
    // 直接返回精灵物体对象（而非 new 创建的空白对象）
    return sprite
  }
}