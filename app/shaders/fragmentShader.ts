export default /* glsl */ `

uniform sampler2D uTexture;
uniform float uTime;
uniform float uRadius;
uniform float uNbRows;
uniform float uNbColumns;




in vec3 vPosition;
out vec4 outColor;


void main() {

vec2 pointUv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
float texOffsetU = (vPosition.x/uNbColumns)+0.5;
float texOffsetv = (vPosition.y/uNbRows)+0.5;

vec2 tileOffset = vec2(
    (vPosition.x / uNbColumns) + 0.5,
    (vPosition.y / uNbRows) + 0.5
);

pointUv = tileOffset + (pointUv * vec2(1.0 / uNbColumns, 1.0 / uNbRows));





vec4 texcol = texture(uTexture,pointUv);


outColor = texcol;

if(outColor.r<=0.1){
discard;
}

}

`;
