uniform vec3 uColor;
uniform float uActive;
uniform float uEnter;

void main() {
  vec3 color1 = uColor;
  vec3 color2 = vec3(0.984, 0.313, 0.0);
  vec3 colorf = mix(color1, color2, uEnter * 0.9);

  gl_FragColor = vec4(colorf, uActive);
}