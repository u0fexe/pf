varying vec3 vColor;
uniform sampler2D uTexture;

void main() {
	gl_FragColor = vec4(vColor, 1.0) * texture2D(uTexture, gl_PointCoord);
}
