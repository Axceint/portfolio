export default `
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {

	vNormal = normal;
	vUv = uv;
	vPosition = position;
	vec4 modelView = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelView ;
}
`;

