uniform float uActive;
uniform float uDeform;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.x += cos((uDeform + modelPosition.x) * 3.0) * 80.0 * uDeform;
  modelPosition.y += sin((uDeform + modelPosition.y) * 3.0) * 80.0 * uDeform;
  modelPosition.z += sin((uDeform + modelPosition.y) * 3.0) * 80.0 * uDeform;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}