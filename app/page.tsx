"use client";

import { useEffect, useRef } from "react";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    if (!backRef.current) {
      return;
    }
    let canvasHeight = canvasRef.current?.clientHeight;
    let canvasWidth = canvasRef.current?.clientWidth;
    let backHeight = backRef.current.clientHeight;
    let backWidth = backRef.current.clientWidth;

    const backRenderer = new three.WebGLRenderer({
      canvas: backRef.current,
      alpha: true,
    });
    backRenderer.setSize(canvasWidth, canvasHeight);
    backRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const canvasRenderer = new three.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    canvasRenderer.setSize(canvasWidth, canvasHeight);
    canvasRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const camera = new three.PerspectiveCamera(
      50,
      canvasWidth / canvasHeight,
      0.1,
      2000,
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const orbit = new OrbitControls(camera, canvasRef.current);
    orbit.enableDamping = true;
    orbit.dampingFactor += 0.1;

    const canvasScene = new three.Scene();
    const backScene = new three.Scene();

    const sphere = new three.Mesh(
      // new three.SphereGeometry(5, 10, 10),

      new three.PlaneGeometry(10, 10),

      // new three.BoxGeometry(10, 10, 10),

      // new three.MeshToonMaterial({ color: 0xffffff }),
      // new three.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
      new three.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // wireframe: true,
        // glslVersion: three.GLSL3,
        side: three.DoubleSide,
      }),
    );

    const light = new three.PointLight(0xffffff, 10, 10000, 0);
    const cube2 = new three.Mesh(
      new three.BoxGeometry(5, 8, 2),
      new three.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
    );
    canvasScene.add(sphere);
    // backScene.add(cube2);

    function animate() {
      // sphere.rotation.y += 0.001;
      // cube2.rotation.y += 0.001;

      canvasRenderer.render(canvasScene, camera);
      backRenderer.render(backScene, camera);

      orbit.update();
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <>
      <main className="h-screen w-screen pl-[2.5%] pr-[2.5%] pt-[1.5%] pb-[1.5%] flex flex-col items-center justify-center ">
        <canvas ref={backRef} className="absolute h-full w-full "></canvas>
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

        {/* <nav className="border-b border-white/20">e</nav> */}

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
          <span className="pr-[2.5%]">10</span>
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
