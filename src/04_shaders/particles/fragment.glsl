varying vec3 vColor;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
	gl_FragColor = vec4(vColor, uOpacity) * texture2D(uTexture, gl_PointCoord);
}
