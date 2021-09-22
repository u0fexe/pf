uniform float uProgress;
uniform float uScrollLength;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 newPosition = position;

  newPosition.x *= uProgress;
  newPosition.y = -uScrollLength * (1.0 - uProgress) + position.y * uProgress;
  newPosition.z *= uProgress;

  newPosition.x += cos(uTime + position.x) * 100.0;
  newPosition.z += sin(uTime + position.y) * 100.0;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  gl_PointSize = 1.0;
  gl_Position = projectedPosition;

  vUv = uv;
}