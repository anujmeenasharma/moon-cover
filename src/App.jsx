import { useRef } from "react";
import useLenis from "./hooks/useLenis";
import Noise from "./components/UiComponents/Noise";
import Crosshair from "./components/UiComponents/Crosshair";
import SparkCursor from "./components/UiComponents/SparkCursor";
import Details from "./components/Pages/Home/Details";
import LaunchLab from "./components/Pages/Home/LaunchLab";
import StackCards from "./components/Pages/Home/StackCards";
import LandingPage from "./components/Pages/Home/LandingPage";
import GlobalScene from "./components/GlobalScene";
import Brands from "./components/Pages/Home/Brands";
import VerticalScrollProgress from "./components/UiComponents/VerticalScrollProgress";
import SphereScene from "./components/SphereScene";
import GlobalIcons from "./components/UiComponents/globalIcons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
function App() {
  const containerRef = useRef(null)
  useLenis()

  useGSAP(()=>{
    gsap.to("#launchlab", {
      backgroundColor: "#dadada",
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top -450%",
        end: "+=1000",
        scrub: 1,
        toggleActions: "play none none reverse"
      }
    })
  })
  
  return (
    <div className="relative h-full w-full" ref={containerRef}>
      <SparkCursor 
        sparkColor='#fff'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >

        <SphereScene />

        <GlobalIcons />
        {/* Vertical progress indicator */}
        <VerticalScrollProgress 
          sectionIds={["landing","details","launchlab","stackcards","brands"]}
          toolTipNames={["Intro","Details","LaunchLab","Stack Cards","Brands"]}
          position="bottom-left"
          tooltipSide="right"
          barHeight="18vh"
        />

        {/* <Crosshair color="#fff" /> */}

        <section id="landing">
          <LandingPage />
        </section>
        <section id="details">
          <Details />
        </section>
        <section className="relative h-[500vh] bg-transparent z-[999999] w-full" id="launchlab">
          <LaunchLab />
        </section>
        <section id="stackcards">
          <StackCards />
        </section>
        <section id="brands">
          <Brands />
        </section>
      </SparkCursor>
    </div>
  );
}

export default App;
