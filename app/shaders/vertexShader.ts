export default /* glsl */ `
uniform float uTime;
out vec3 vPosition;
out vec3 vNormal;
out vec2 vUv;

void main() {
  vNormal = normal;
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  }
`;
