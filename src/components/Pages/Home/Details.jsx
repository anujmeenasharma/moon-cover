import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react";
import ScrambleText from "../../UiComponents/ScrambleText";

gsap.registerPlugin(SplitText, ScrollTrigger)

const Details = () => {
  const detailsRef = useRef(null)
  const titleRef = useRef(null)
  const containerRef = useRef(null)
  const mainContainerRef = useRef(null)
  const stickyWrapperRef = useRef(null)

  useGSAP(()=>{
    document.fonts.ready.then(() => {
      const detailsEl = detailsRef.current
      const titleEl = titleRef.current
      const stickyEl = stickyWrapperRef.current
      if (!detailsEl || !titleEl || !stickyEl) return

      const split = SplitText.create(detailsEl, { 
        type: "words", 
        aria: "hidden" 
      });

      const splitTitle = SplitText.create(titleEl, { 
        type: "words", 
        wordsClass: "word",
        mask: "words",
        autoSplit: true,
      });

      gsap.set(split.words, { opacity: 0 });

      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: stickyEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          toggleActions: "play none none reverse"
        }
      });

      gsap.from(splitTitle.words, {
        y: 200,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.inOut",
        duration: 2,
        scrollTrigger: {
          trigger: stickyEl,
          start: "top 98%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Animate containerRef opacity from 0 to 1 on scroll, but start much later
      // For example, start when the stickyWrapper is 30% from the top of the viewport
      // and finish when it's 10% from the top
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stickyWrapperRef.current,
            start: "top 30%",
            end: "top 10%",
            scrub: true,
            // markers: true, // Uncomment for debugging
            toggleActions: "play none none reverse"
          }
        }
      );

    });
  })

  return (
    <div ref={stickyWrapperRef} className="relative w-full" style={{ height: "400vh" }}>
      <div ref={mainContainerRef} className="sticky top-0 h-screen w-full z-20 overflow-hidden flex gap-4 flex-col items-center justify-center">
        {/* <div ref={containerRef} className="h-screen w-full bg-black absolute flex items-center justify-center top-0 left-0" style={{ opacity: 0 }}>
          <div 
            className="rounded-full relative"
            style={{
              width: '735px',
              height: '735px',
              background: 'linear-gradient(45deg, #D1E40F 0%, #FF6B1A 100%)',
              filter: 'blur(200px)',
              position: 'relative'
            }}
          >
            
            <div 
              className="absolute inset-0 rounded-full opacity-15"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay'
              }}
            />
          </div>
        </div> */}
       {/*<h1 ref={titleRef} className="text-5xl uppercase font-bold telegraf">
          we don't flip brands. we build futures.
        </h1> */}
        <div className="relative text-center w-full" ref={titleRef}>
          <ScrambleText textSize="5xl" text="we don't flip brands. we build futures."/>
        </div>
        <div className="relative text-center w-[70%]">
          <p ref={detailsRef} className="animate-me" aria-hidden="true">
            Most brand builders chase quick exits and financial engineering. We craft enduring consumer experiences that own moments, shape categories, and live in people's daily lives. Our approach combines the creative instincts of a growth studio with the operational precision of a technology platform. We identify high-potential consumer products, then apply our proprietary LaunchLab™ system to build authentic brand stories that resonate with modern audiences.
          </p>
          <p className="sr-only">
            Most brand builders chase quick exits and financial engineering. We craft enduring consumer experiences that own moments, shape categories, and live in people's daily lives. Our approach combines the creative instincts of a growth studio with the operational precision of a technology platform. We identify high-potential consumer products, then apply our proprietary LaunchLab™ system to build authentic brand stories that resonate with modern audiences.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Details