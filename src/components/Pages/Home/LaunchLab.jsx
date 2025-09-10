import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlobalScene from "../../GlobalScene";

const LaunchLab = () => {
  const launchLabRef = useRef(null);
  const stickyRef = useRef(null);
  const textRef = useRef(null);
  const counterRef = useRef(null);
  const numbersWrapperRef = useRef(null);
  const [modelIndex, setModelIndex] = useState(0);

  const models = ["Box", "Sphere", "Torus", "Cone"];
  const modelContent = [
    {
      title: "SMART",
      description:
        "AI-driven creative and marketing optimization across every touchpoint",
    },
    {
      title: "FRAME",
      description:
        "Design frameworks that align product, brand, and performance at scale",
    },
    {
      title: "DATA",
      description:
        "Realtime insight loops to inform messaging, media, and merchandising",
    },
    {
      title: "CONNECT",
      description:
        "Full-funnel orchestration to convert attention into lasting affinity",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    document.body.style.backgroundColor = "black";

    const bgTrigger = ScrollTrigger.create({
      trigger: launchLabRef.current,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        gsap.to(document.body, {
          duration: 1,
          backgroundColor: "#dadada",
          ease: "power2.inOut",
        });
      },
      onLeave: () => {
        gsap.to(document.body, {
          duration: 1,
          backgroundColor: "black",
          ease: "power2.inOut",
        });
      },
      onEnterBack: () => {
        gsap.to(document.body, {
          duration: 1,
          backgroundColor: "#dadada",
          ease: "power2.inOut",
        });
      },
      onLeaveBack: () => {
        gsap.to(document.body, {
          duration: 1,
          backgroundColor: "black",
          ease: "power2.inOut",
        });
      },
    });

    const totalSegments = models.length + 1; // extra segment to hold on last model
    const modelsTrigger = ScrollTrigger.create({
      trigger: launchLabRef.current,
      start: "top top",
      end: () => "+=" + window.innerHeight * totalSegments,
      scrub: true,
      snap: 1 / totalSegments,
      onUpdate: (self) => {
        const idx = Math.min(
          models.length - 1,
          Math.floor(self.progress * totalSegments)
        );
        setModelIndex(idx);
      },
    });

    return () => {
      bgTrigger && bgTrigger.kill();
      modelsTrigger && modelsTrigger.kill();
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Show text immediately on first model; animate only on subsequent changes
  const hasShownOnceRef = useRef(false);
  useEffect(() => {
    if (!textRef.current) return;
    if (!hasShownOnceRef.current && modelIndex === 0) {
      gsap.set(textRef.current, { autoAlpha: 1, y: 0 });
      hasShownOnceRef.current = true;
      return;
    }
    gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [modelIndex]);

  useEffect(() => {
    if (!numbersWrapperRef.current) return;
    gsap.to(numbersWrapperRef.current, {
      y: -modelIndex * 24, // adjust depending on line height
      duration: 0.6,
      ease: "power3.inOut",
    });
  }, [modelIndex]);

  return (
    <div
      ref={launchLabRef}
      className="relative w-full"
      style={{ height: "500vh" }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen w-full">
        <GlobalScene curGeometry={models[modelIndex]} hideControls={true} />
        <div
          className="w-full h-screen z-40 absolute top-0 left-0 flex items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <div className="text-center flex flex-col gap-[25vw] launchlab-text w-full items-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm uppercase font-light">
                Where Science Meets Story
              </p>
              <img src="/launchlab.svg" alt="launchLab" className="w-[20vw]" />
              <p className="w-[50%] mx-auto font-light text-sm">
                Our proprietary growth engine compresses the typical
                brand-building timeline from years to months. Five integrated
                systems working as one intelligence.
              </p>
            </div>
            <div
              ref={textRef}
              className="flex flex-col gap-6 will-change-transform"
            >
              <h1 className="text-5xl uppercase font-black telegraf">
                {modelContent[modelIndex].title}
              </h1>
              <p className="w-[70%] mx-auto font-light text-sm">
                {modelContent[modelIndex].description}
              </p>
            </div>
            <div
              className="absolute bottom-7 left-1/3 -translate-x-1/2"
              ref={counterRef}
            >
              <div className="flex flex-col h-6 overflow-hidden font-bold">
                <div ref={numbersWrapperRef} className="flex flex-col">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchLab;
