import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three/webgpu";
import { Sphere } from "./Sphere";
import { Torus } from "./Torus";
import { SphereProcessing } from "./SphereProcessing";

function SphereScene() {
  const [frameloop, setFrameloop] = useState("never");
  const canvasElRef = useRef(null);
  const ppSettings = useControls("Post Processing", {
    strength: {
      value: 4.5,
      min: 0,
      max: 30,
      step: 0.1,
    },
    radius: {
      value: 1.0,
      min: 0,
      max: 4,
      step: 0.1,
    },
    threshold: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  // Animated PostProcessing values (start at current controls)
  const [ppStrength, setPpStrength] = useState(ppSettings.strength);
  const [ppRadius, setPpRadius] = useState(ppSettings.radius);
  const [ppThreshold, setPpThreshold] = useState(ppSettings.threshold);
  const basePPRef = useRef({ strength: ppSettings.strength, radius: ppSettings.radius, threshold: ppSettings.threshold });

  // Keep base in sync if user moves the Leva sliders
  useEffect(() => {
    basePPRef.current = {
      strength: ppSettings.strength,
      radius: ppSettings.radius,
      threshold: ppSettings.threshold,
    };
    setPpStrength(ppSettings.strength);
    setPpRadius(ppSettings.radius);
    setPpThreshold(ppSettings.threshold);
  }, [ppSettings.strength, ppSettings.radius, ppSettings.threshold]);

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

  // Scroll-driven bloom increase: start from current Leva values → go to max
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const progress = { p: 0 };
      gsap.to(progress, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "+=3000",
          scrub: 0.6,
        },
        onUpdate: () => {
          const base = basePPRef.current;
          // Animate to explicit targets provided by user
          const targetStrength = 10;
          const targetRadius = 1.5;
          const targetThreshold = 0.0;
          setPpStrength(base.strength + progress.p * (targetStrength - base.strength));
          setPpRadius(base.radius + progress.p * (targetRadius - base.radius));
          setPpThreshold(base.threshold + progress.p * (targetThreshold - base.threshold));
        },
      });
    });
    return () => ctx.revert();
  }, []);

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
        <SphereProcessing strength={ppStrength} radius={ppRadius} threshold={ppThreshold} />
      </Canvas>
    </>
  );
}

export default SphereScene;