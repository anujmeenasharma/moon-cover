import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three/webgpu";
import { Sphere } from "./Sphere";
import { Torus } from "./Torus";
// Bloom post-processing removed to prevent black background issues

function SphereScene() {
  const [frameloop, setFrameloop] = useState("never");
  const canvasElRef = useRef(null);
  // Post-processing controls removed

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasElRef.current;
    if (!canvas) return;

    const ctx = gsap.context(() => {
      gsap.set(canvas, { opacity: 1 });
      const tl = gsap.timeline();
      // tl.to(canvas, {
      //   opacity: 0,
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger: canvas,
      //     start: "top -340%",
      //     end: "+=1500",
      //     scrub: 0.6,
      //     invalidateOnRefresh: true
      //   },
      // });

      // tl.to(canvas, {
      //   opacity: 1,
      //   duration: 2,
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger: canvas,
      //     markers: true,
      //     start: "200% -900%",
      //     end: "+=1500",
      //     scrub: 0.6,
      //     invalidateOnRefresh: true
      //   },
      // });
    });

    return () => ctx.revert();
  }, [frameloop]);

  // Bloom scroll animation removed

  return (
    <>
      {/* <Stats /> */}
      <Canvas
        shadows
        style={{ background: 'transparent', position: 'fixed', inset: 0 }}
        frameloop={frameloop}
        onCreated={({ scene, gl }) => {
          scene.background = null;
          if (gl && typeof gl.setClearColor === 'function') {
            gl.setClearColor(0x000000, 0);
          }
          if (gl && gl.domElement) {
            gl.domElement.style.background = 'transparent';
            canvasElRef.current = gl.domElement;
          }
        }}
        gl={(canvas) => {
          const renderer = new THREE.WebGPURenderer({
            canvas,
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            stencil: false,
          });
          renderer.setClearColor(0x000000, 0);
          renderer.init().then(() => {
            setFrameloop("always");
          });
          return renderer;
        }}
      >
        <Suspense>
          <Sphere />
          <Torus />
        </Suspense>
        {/* Post-processing removed */}
      </Canvas>
    </>
  );
}

export default SphereScene;