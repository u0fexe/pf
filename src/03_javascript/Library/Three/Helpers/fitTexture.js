export default function(texture, plane) {
  texture.matrixAutoUpdate = false
  const aspect = plane.width / plane.height
  const imageAspect = texture.image.width / texture.image.height
  if ( aspect < imageAspect ) {
    texture.matrix.setUvTransform( 0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5 )
  } else {
    texture.matrix.setUvTransform( 0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5 )
  }
}