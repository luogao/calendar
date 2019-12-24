import React, { PureComponent } from 'react';
import * as THREE from 'three';
import { snowflakeImageDate } from '../../constants';

interface SnowflakeBGProps {

}

interface SnowflakeBGState {

}

function randomRange (min: number, max: number) {
  return Math.random() * (max - min) + min
}

class SnowflakeBG extends PureComponent<SnowflakeBGProps, SnowflakeBGState> {

  container = React.createRef<HTMLDivElement>();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000)
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ alpha: true })
  particles: any[] = []
  material: THREE.SpriteMaterial | null = null // = new THREE.SpriteMaterial({ map: map })
  map: THREE.Texture | null = null
  textureLoader: THREE.TextureLoader | null = null
  halfX = window.innerWidth / 2
  halfY = window.innerHeight / 2
  mouseX = 0
  mouseY = 0
  fallSpeen = 2
  amount = 1000

  componentDidMount () {
    this.init()
  }

  init = () => {

    this.camera.position.z = 100

    this.textureLoader = new THREE.TextureLoader()
    this.map = this.textureLoader.load(snowflakeImageDate)
    this.material = new THREE.SpriteMaterial({ map: this.map })

    for (let i = 0; i < this.amount; i++) {
      const particle = new THREE.Sprite(this.material)
      const randomScale = randomRange(10, 20)

      particle.position.x = randomRange(-1000, 1000)
      particle.position.y = randomRange(-1000, 1000)
      particle.position.z = randomRange(-1000, 1000)
      particle.scale.x = particle.scale.y = particle.scale.z = randomScale
      particle.v = new THREE.Vector3(0, -this.fallSpeen, 0)
      particle.v.z = 1 * randomRange(-1, 1)
      particle.v.x = 1 * randomRange(-1, 1)

      this.particles.push(particle)
      this.scene.add(particle)
    }
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container && this.container.current && this.container.current.appendChild(this.renderer.domElement)

    document.addEventListener('mousemove', this.mouseHandler, false)
    document.addEventListener('touchstart', this.touchHandler, false)
    document.addEventListener('touchmove', this.touchHandler, false)

    this.animate()
  }

  mouseHandler = (ev: MouseEvent) => {
    this.mouseX = ev.clientX - this.halfX
    this.mouseY = ev.clientY - this.halfY
  }

  touchHandler = (ev: TouchEvent) => {
    ev.preventDefault()
    this.mouseX = ev.touches[ 0 ].pageX - this.halfX
    this.mouseY = ev.touches[ 0 ].pageY - this.halfY
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.renderCanvas()
  }

  renderCanvas = () => {
    for (var i = 0; i < this.particles.length; i++) {
      const particle = this.particles[ i ]
      const pp = particle.position

      pp.add(particle.v)

      if (pp.y < -1000) pp.y = 1000
      if (pp.x > 1000) pp.x = -1000
      else if (pp.x < -1000) pp.x = 1000
      if (pp.z > 1000) pp.z = -1000
      else if (pp.z < -1000) pp.z = 1000
    }

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.0005
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.0005
    this.camera.lookAt(this.scene.position)

    this.renderer.render(this.scene, this.camera)
  }

  render () {
    return <div ref={ this.container } style={ {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    } }></div>;
  }
}

export default SnowflakeBG;