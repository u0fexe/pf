varying vec3 vColor;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
	float mid = 0.5;
	vec2 rotated = vec2(cos(uTime) * (gl_PointCoord.x - mid) + sin(uTime) * (gl_PointCoord.y - mid) + mid,
											cos(uTime) * (gl_PointCoord.y - mid) - sin(uTime) * (gl_PointCoord.x - mid) + mid);
	gl_FragColor = vec4(vColor, uOpacity) * texture2D(uTexture, rotated);
}
