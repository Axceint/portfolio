"use client";

import { useEffect, useRef, useState } from "react";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

import img from "../public/img.png";
import { randFloat } from "three/src/math/MathUtils.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backRef = useRef<HTMLCanvasElement | null>(null);
  const [timeNow, setTimeNow] = useState<string | null>(
    `(⌐■_■) uhm actually the time is`,
  );
  function updateTimeNow() {
    let now = new Date();
    let second = now.getSeconds();
    let minute = now.getMinutes();
    let hour = now.getHours();
    let time = `${hour}:${minute}:${second}`;
    setTimeNow(time);
  }

  async function loadTexture(thing: string) {
    const textureLoader = new three.TextureLoader();
    const texture = await textureLoader.loadAsync(thing);
    return texture;
  }

  useEffect(() => {
    // We removed canvasRef from the DOM temporarily, so don't return if it's missing
    // if (!canvasRef.current) {
    //   return;
    // }
    if (!backRef.current) {
      return;
    }

    // Since canvasRef is commented out, let's use backRef for everything
    let canvasHeight = backRef.current.clientHeight;
    let canvasWidth = backRef.current.clientWidth;
    let backHeight = backRef.current.clientHeight;
    let backWidth = backRef.current.clientWidth;

    const backRenderer = new three.WebGLRenderer({
      canvas: backRef.current,
      alpha: true,
    });
    backRenderer.setSize(canvasWidth, canvasHeight);
    backRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    // const canvasRenderer = new three.WebGLRenderer({
    //   canvas: canvasRef.current,
    //   alpha: true,
    // });
    // canvasRenderer.setSize(canvasWidth, canvasHeight);
    // canvasRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const camera = new three.PerspectiveCamera(
      50,
      canvasWidth / canvasHeight,
      0.1,
      100000,
    );
    camera.position.set(0, 0, 250);
    camera.lookAt(0, 0, 0);

    const orbit = new OrbitControls(camera, backRef.current);
    orbit.enableDamping = true;
    orbit.dampingFactor += 0.1;

    const canvasScene = new three.Scene();
    const backScene = new three.Scene();
    //
    //
    //
    //

    const multiplier = 18;

    const nbColoumns = 16.0 * multiplier;
    const nbRows = 9.0 * multiplier;

    const vertices = new Float32Array(nbColoumns * nbRows * 3);
    const initPoint = new Float32Array(nbColoumns * nbRows * 3);

    let index = 0;

    for (let i = 0; i < nbColoumns; i++) {
      for (let j = 0; j < nbRows; j++) {
        // We must calculate the exact coordinate index.
        // Wait, the X value needs to span exactly the width of the grid!
        let x = (i / nbColoumns) * nbColoumns - nbColoumns / 2.0;
        let y = (j / nbRows) * nbRows - nbRows / 2.0;

        vertices[index] = x;
        vertices[index + 1] = y;
        vertices[index + 2] = 0;

        initPoint[index] = randFloat(-1000.0, 1000.0);
        initPoint[index + 1] = randFloat(-1000.0, 1000.0);
        initPoint[index + 2] = randFloat(-1000.0, 1000.0); // Changed from 10000 to keep it visible/manageable

        index += 3; // IMPORTANT: each point takes 3 slots!
      }
    }
    console.log(vertices);
    console.log(initPoint);

    const geometry = new three.BufferGeometry();

    // const vertices = new Float32Array([
    //   -1.0, -1.0, 0.0,

    //   1.0, -1.0, 0.0,

    //   1.0, 1.0, 0.0,

    //   -1.0, 1.0, 0.0,
    // ]);

    geometry.setAttribute("position", new three.BufferAttribute(vertices, 3));
    geometry.setAttribute(
      "initPosition",
      new three.BufferAttribute(initPoint, 3),
    );

    // Hoist uniforms so they can be updated in the animation loop
    const shaderUniforms = {
      uPointSize: { value: 4.0 },
      uTime: { value: 0.0 }, // Will be updated dynamically
      uRadius: { value: 1.0 },
      uTexture: { value: null as any },
      uNbRows: { value: nbRows },
      uNbColumns: { value: nbColoumns },
    };

    // geometry.center();
    (async () => {
      const texture = await loadTexture("/img.png"); // ✅ Await texture first

      shaderUniforms.uTexture.value = texture;

      const material = new three.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: three.DoubleSide,
        glslVersion: three.GLSL3,
        uniforms: shaderUniforms,
        // uniforms: { // <-- Old uniforms commented out
        //   uPointSize: { value: 3.0 },
        //   uTime: { value: parseFloat(Math.floor((Date.now() % 10000) / 1000)) },
        //   uRadius: { value: 1.0 },
        //   uTexture: { value: texture },
        //   uNbRows: { value: nbRows },
        //   uNbColumns: { value: nbColoumns },
        // },
        depthTest: false,
        depthWrite: false,
        transparent: true,
      });

      const mesh = new three.Points(geometry, material);
      // mesh.geometry.center(); // Commmented out because it messes up grid alignment
      backScene.add(mesh);
    })();

    //
    //
    //
    //

    // const sphereMaterial = new three.ShaderMaterial({
    //   vertexShader: vertexShader,
    //   fragmentShader: fragmentShader,
    //   // wireframe: true,
    //   glslVersion: three.GLSL3,
    //   side: three.DoubleSide,
    //   uniforms: {
    //     uTime: { value: 0.0 },
    //     uRadius: { value: 0.5 },
    //     uTexture: { value: new three.TextureLoader().load("/img.png") },
    //   },
    // });
    // sphereMaterial.uniforms.uTime = { value: 0 };

    // const sphere = new three.Mesh(
    //   new three.SphereGeometry(5, 32, 32),

    //   // new three.PlaneGeometry(7.5, 7.5),

    //   // new three.BoxGeometry(5, 5, 5),

    //   // new three.MeshToonMaterial({ color: 0xffffff }),
    //   // new three.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
    //   sphereMaterial,
    // );

    // const light = new three.PointLight(0xffffff, 10, 10000, 0);
    // const cube2 = new three.Mesh(
    //   new three.BoxGeometry(5, 8, 2),
    //   new three.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
    // );
    // canvasScene.add(sphere);
    // backScene.add(cube2);
    let timeId;
    timeId = setInterval(updateTimeNow, 1000);

    const clock = new three.Clock(); // Added clock for smooth animation

    function animate() {
      // sphere.rotation.y += 0.001;
      // cube2.rotation.y += 0.001;

      // Update shader time here
      shaderUniforms.uTime.value = clock.getElapsedTime();

      // canvasRenderer.render(canvasScene, camera);
      backRenderer.render(backScene, camera);

      orbit.update();
      // console.log(Math.floor((Date.now() % 10000) / 1000));

      // sphereMaterial.uniforms.uTime.value = (Date.now() % 10000) / 10000;

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <>
      <main className="h-screen w-screen pl-[2.5%] pr-[2.5%] pt-[1.5%] pb-[1.5%] flex flex-col items-center justify-center ">
        <canvas ref={backRef} className="absolute h-full w-full "></canvas>
        {/*
        <span
          className="top-[1%] right-[1%] border-t border-r p-5 absolute"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        ></span>
        <span
          className="bottom-[1%] left-[1%] border-b border-l p-5 absolute"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        ></span>
        <span
          className="bottom-[1%] right-[1%] border-b border-r p-5 absolute"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        ></span>
        <span
          className="top-[1%] left-[1%]  border-t border-l p-5 absolute"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        ></span>

        <nav className="border-b border-white/20">e</nav>

        <header
          className="border-b w-full h-fit flex flex-row items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.25)" }}
        >
          <span className="pl-[2.5%]">
            <span className="text-4xl pr-10">AXCE</span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              | EST-2025
            </span>
          </span>
          <span className="pr-[2.5%]">{timeNow}</span>
        </header>

        <main className=" h-full w-full m-[5%] flex flex-row items-center justify-center ">
          <canvas ref={canvasRef} className="h-full w-[50%]"></canvas>

          <section className=" h-full w-full flex flex-col items-center justify-center relative ">
            <div className="relative bottom-[5%] right-[0%] opacity-25">
              __________________________________________________________________________________ヾ(•ω•`)o____
            </div>
            <span
              className=" text-6xl text-center font-bold font-mono border-l  pl-[2.5%] pb-[2.5%] pr-[2.5%]"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                borderStyle: "dashed",
              }}
            >
              NOTHING BEGINS COMPLETE.
            </span>
            <span className="text-xl text-center font-mono ">
              Through repetition, failure, and reconstruction, form emerges
              slowly.
            </span>
            <span className="text-xl text-center font-mono">
              every idea is refined through motion.
            </span>
            <br />
            <div className="h-[10%] w-[50%] flex items-center justify-around font-mono">
              <button className="border pr-[5%] pl-[5%] pt-[2.5%] pb-[2.5%]">
                BEGIN
              </button>
              <button className="border pr-[5%] pl-[5%] pt-[2.5%] pb-[2.5%]">
                EXPLORE WORK
              </button>
            </div>
            <div className="relative bottom-[-5%] right-[0%] opacity-25">
              <span className="text-[0.5rem]">AXCE_INT</span>
              ______________________________________________________________________________________
            </div>
          </section>
        </main>

        <footer
          className="h-fit border-t w-full flex flex-row items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.25)" }}
        >
          <span className="text-[0.5rem]">
            SYSTEM.ACTIVE V1.1.2 (￣▽￣)╭ Ohohoho.....
          </span>
          <span className="text-[0.5rem]">RENDERING FRAME: {"bleh :3"}</span>
        </footer>
        */}
      </main>
    </>
  );
}

// export default /* glsl */ `

// uniform float uTime;
// in vec3 vPosition;
// in vec3 vNormal;
// flat in vec2 vUv;

// out vec4 outColor;

// void main() {
// vec3 color = normalize(vPosition)*0.5 +0.5;
//   outColor = vec4(color.x,vPosition.x,vPosition.x, 1.0);
// }

// `;
// export default /* glsl */ `
// uniform float uTime;
// out vec3 vPosition;
// out vec3 vNormal;
// flat out vec2 vUv;

// void main() {
//   vNormal = normal;
//   vUv = uv;
//   vPosition = position;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// export default /* glsl */ `

// uniform sampler2D uTexture;
// uniform float uTime;
// uniform float uRadius;

// in vec3 vPosition;
// in vec3 vNormal;
// in vec2 vUv;

// out vec4 outColor;

// vec4 drawCircle( vec2 position, vec2 center){
//     return vec4(vec3(distance(vUv,vec2(+0.5,+0.5))),1.0);
// }
// float drawSquare(vec2 position, vec2 center){
//     vec2 d = abs(position) - center;
//     return length(max(d,0.0))+min(max(d.x,d.y),0.0);
// }

// float rand(vec3 p) {
//     p = fract(p * 0.3183099 + 0.1);
//     p *= 17.0;
//     return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
// }
// float noise(vec3 p) {
//     vec3 i = floor(p);
//     vec3 f = fract(p);

//     // smooth interpolation
//     f = f * f * (3.0 - 2.0 * f);

//     float a = rand(i);
//     float b = rand(i + vec3(1.0, 0.0, 0.0));
//     float c = rand(i + vec3(0.0, 1.0, 0.0));
//     float d = rand(i + vec3(1.0, 1.0, 0.0));
//     float e = rand(i + vec3(0.0, 0.0, 1.0));
//     float f1 = rand(i + vec3(1.0, 0.0, 1.0));
//     float g = rand(i + vec3(0.0, 1.0, 1.0));
//     float h = rand(i + vec3(1.0, 1.0, 1.0));

//     float x1 = mix(a, b, f.x);
//     float x2 = mix(c, d, f.x);
//     float y1 = mix(x1, x2, f.y);

//     float x3 = mix(e, f1, f.x);
//     float x4 = mix(g, h, f.x);
//     float y2 = mix(x3, x4, f.y);

//     return mix(y1, y2, f.z);
// }
// float ring(vec3 position){
//     return smoothstep(0.0, 1.0, sin(position.y * 25.0 + uTime*20.0 ));

// }

// void main() {
// vec2 uv = vUv;
// uv.x += uTime;
// uv.y += uTime;
// vec3 p = vPosition * 5.0;
// p += vec3(0.0, 0.0, uTime * 0.1);
// float n = noise(p);

// outColor = vec4(vec3(ring(n+p)), 1.0);
// // outColor = vec4(vec3(noise(vec3(uv*10.0,mod(uTime * 0.1, 100.0)))),1.0);

// }

// `;
