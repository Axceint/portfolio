export default /* glsl */ `

uniform float uTime;
in vec3 vPosition;
in vec3 vNormal;
in vec2 vUv;

out vec4 outColor;

void main() {
vec3 color = normalize(vPosition)*0.5 +0.5;
vec2 uv = vUv*100.0;
uv -= vec2(0.5);
vec3 viewDirection = normalize(cameraPosition-vPosition);
float bdot = 1.0 - dot(viewDirection,vNormal);
  
outColor = vec4(step(0.99,1.0 - abs(vec3((vUv.y-0.5)))),1.0);


}

`;

// outColor = vec4(vec3(mix(1.0, 0.1, vUv.x)), 1.0);
