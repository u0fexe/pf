uniform vec3 uColor;
uniform float uActive;

void main() {
  gl_FragColor = vec4(uColor, uActive);
}