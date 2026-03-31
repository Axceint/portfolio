export default /* glsl */ `
uniform float uTime;
uniform float uRadius;
uniform float uPointSize;
out vec3 vPosition;
in vec3 initPosition;


void main() {
#include <begin_vertex>
  gl_PointSize = uPointSize;
  vPosition = position;
  
  // smoothstep returns a float between 0 and 1, we mix initPosition and transformed (which is position)
  // To increase the animation length, change the second parameter (2.0) to a higher value like 5.0 or 10.0 seconds!
  float progress = smoothstep(0.0, 600.0, uTime);
  transformed = mix(initPosition, transformed, progress);
  
 
  
  #include <project_vertex>
// gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  }
`;
