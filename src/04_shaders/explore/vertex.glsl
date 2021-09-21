uniform float uActive;
uniform float uDeform;
uniform float uTime;
uniform vec3 uMouse;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.x += cos((uDeform + modelPosition.x) * 3.0) * 80.0 * uDeform;
  modelPosition.y += sin((uDeform + modelPosition.y) * 3.0) * 80.0 * uDeform;
  modelPosition.z += sin((uDeform + modelPosition.y) * 3.0) * 80.0 * uDeform;

  modelPosition.z += cos(uTime + modelPosition.x * 0.1) * 10.0 * uMouse.z;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}