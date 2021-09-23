attribute float size;
uniform float uProgress;
uniform float uScrollLength;
uniform float uTime;
varying vec3 vColor;

void main() {
  vec3 newPosition = position;


  newPosition.x *= uProgress;
  newPosition.y = -uScrollLength * (1.0 - uProgress) + position.y * uProgress;
  newPosition.z *= uProgress;


  newPosition.x += cos(uTime + position.x) * 100.0;
  newPosition.y += sin(uTime * 0.5 + position.y) * 200.0;
  newPosition.z += sin(uTime + position.y) * 100.0;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  gl_PointSize = size * ( 2000.0 / -viewPosition.z );
  gl_Position = projectedPosition;

  vColor = color;
}