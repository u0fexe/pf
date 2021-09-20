import { Mesh, PlaneBufferGeometry } from "three"

export default function(axis, angle, material) {
  const geometry = new PlaneBufferGeometry(1, 1, 1, 1)
  geometry.translate(0, 0, 0.5)

  if(axis === 'y') {
    geometry.rotateY(angle)
  }

  else if(axis === 'x') {
    geometry.rotateX(angle)
  }

  return new Mesh(geometry, material)
}