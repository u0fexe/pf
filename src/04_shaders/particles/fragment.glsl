varying vec3 vColor;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uOpacityProgress;
uniform float uTime;

void main() {
	float mid = 0.5;
	float time = cos(uTime + gl_PointCoord.x);
	vec2 rotated = vec2(cos(time) * (gl_PointCoord.x - mid) + sin(time) * (gl_PointCoord.y - mid) + mid,
											cos(time) * (gl_PointCoord.y - mid) - sin(time) * (gl_PointCoord.x - mid) + mid);
	gl_FragColor = vec4(vColor, uOpacity - uOpacityProgress * uOpacity) * texture2D(uTexture, rotated);
}
