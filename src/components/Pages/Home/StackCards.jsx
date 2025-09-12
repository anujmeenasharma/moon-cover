import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { projects } from "../../../data/project";
import Card from "./Card";
import { useScroll } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "../../UiComponents/ScrambleText";

gsap.registerPlugin(ScrollTrigger);

const StackCards = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let lenis;

    const initLenis = async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  useGSAP(() => {
    const content = gsap.utils.toArray(".content");
    const total = content.length;

    content.forEach((el, index) => {
      gsap.fromTo(
        el,
        { y: 0 }, // reverse
        {
          scrollTrigger: {
            trigger: container.current,
            start: "bottom bottom",
            end: "+=80%",
            scrub: 1,
            markers: true,
          },
          y: -(total - index) * 200,
          ease: "power2.out",
        }
      );
    });
  });

  return (
    <div ref={container} className="relative z-20 mt-[50vh] min-h-screen">
      <div className="h-screen sticky top-0 w-full flex items-center justify-between px-44">
        {/* <h1 className="text-4xl font-bold telegraf uppercase w-[20%] content">
          BUILT for builders who think bigger
        </h1> */}
        <div className="w-[25%] relative z-[1000]">
          <ScrambleText textSize="4xl" text="BUILT for builders who think bigger"/>
        </div>
        <p className="text-sm w-[20%] content">
          We work with brands that share our belief: that great products deserve
          grestorytelling, and that authentic consumer connection drives
          sustainable competitiadvantage.
        </p>
      </div>
      <div className="content">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <Card
              key={`${project.title}-${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StackCards;
