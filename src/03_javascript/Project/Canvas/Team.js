import { DoubleSide, MeshStandardMaterial, PlaneBufferGeometry, Vector3 } from 'three'
import Employee from './Employee'
import ExplorableObjects from './ExplorableObjects'

export default class Team extends ExplorableObjects {
  constructor(assets) {
    super('employee')

    this.construct(assets)
    this.created = true
    this.events.notify('ready')
  }

  construct(assets) {
    for (let i = assets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assets[i], assets[j]] = [assets[j], assets[i]];
    }

    const geometries = [
      new PlaneBufferGeometry(1, 1, 20, 20),
    ]


    this.createObjects(
      Employee,
      geometries,
      i => {
        const material = new MeshStandardMaterial({ side: DoubleSide, map: assets[i] })
        material.onBeforeCompile = ( shader ) => {

          shader.uniforms.uTime = { value: 0 }

          shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader
          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
              float theta = sin( uTime + (position.y + position.x)) * 0.5;
              float c = cos( theta );
              float s = sin( theta );
              mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
              vec3 transformed = vec3( position ) * m;
              vNormal = vNormal * m;
            `
          );

          material.userData.shader = shader
        }
        return material
      }
    )

    for (let id = 0; id < this.objects.length; id++) {
      this.resize(id)
    }
  }

  matchPosition(id) {
    const object = this.objects[id]
    const box = this.boxes[id]
    const mesh = object.mesh

    const screenWidth = innerWidth - box.width
    const screenHeight = innerHeight - box.height
    const frequency = Math.PI * (this.boxes.length / 2)
    const minimizer = object.step * 0.5 + 0.5

    mesh.position.y = box.y
    mesh.position.x = Math.cos(object.step * frequency) * screenWidth * 1 * minimizer
    mesh.position.z = Math.sin(object.step * frequency) * ((screenHeight + screenWidth) * 1) * minimizer
    object.initialPosition = new Vector3().copy(mesh.position)
  }
}