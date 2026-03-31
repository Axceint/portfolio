# Under Construction

## Uses
### 1. Next.js
### 2. tailwindcss
### 1. three.js


export default /* glsl */ `

uniform sampler2D uTexture;
uniform float uTime;
uniform float uRadius;


in vec3 vPosition;
in vec3 vNormal;
in vec2 vUv;

out vec4 outColor;

vec4 drawCircle( vec2 position, vec2 center){
    return vec4(vec3(distance(vUv,vec2(+0.5,+0.5))),1.0);
}
float drawSquare(vec2 position, vec2 center){
    vec2 d = abs(position) - center;
    return length(max(d,0.0))+min(max(d.x,d.y),0.0);
}


void main() {
vec3 color = normalize(vPosition)*0.5 +0.5;
vec2 uv = vUv;
uv -= vec2(0.5);
vec3 viewDirection = normalize(cameraPosition-vPosition);
float bdot = 1.0 - dot(viewDirection,vNormal);
  
const vec2 center = vec2(0.0);

const vec3 desat = vec3(0.2126,0.7152,0.0722);
// const vec3 desat = vec3(1.0,1.0,1.0);

vec3 obunga = texture(uTexture,vUv).xyz;

outColor = vec4(vec3(dot(desat,obunga)), 1.0); 


}

`;
