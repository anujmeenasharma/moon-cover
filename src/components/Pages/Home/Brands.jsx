import { useGSAP } from "@gsap/react"
import Conversations from "./Conversations"
import Thinking from "./Thinking"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

const Brands = () => {

    const brandsRef = useRef(null)
    const topLineRef = useRef(null)
    const bottomLineRef = useRef(null)
    const leftLineRef = useRef(null)
    const rightLineRef = useRef(null)
    const thinkingRef = useRef(null)

    useGSAP(()=>{
        const topEl = topLineRef.current
        const bottomEl = bottomLineRef.current
        const leftEl = leftLineRef.current
        const rightEl = rightLineRef.current
        const thinkingEl = thinkingRef.current

        // Set initial state with clipPath for reveal effect
        const horizontalEls = [topEl, bottomEl].filter(Boolean)
        if (horizontalEls.length) {
            gsap.set(horizontalEls, {
                clipPath: "inset(0 100% 0 0)",
            })
        }
        const verticalEls = [leftEl, rightEl].filter(Boolean)
        if (verticalEls.length) {
            gsap.set(verticalEls, {
                clipPath: "inset(100% 0 0 0)",
            })
        }

        // Create timeline for reveal animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: brandsRef.current,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            }
        })

        // Animate horizontal lines (top and bottom) - reveal from left to right
        if (horizontalEls.length) gsap.to(horizontalEls, {
            clipPath: "inset(0 0% 0 0)",
            duration: 3,
            ease: "power2.out",
            scrollTrigger: {
                trigger: brandsRef.current,
                start: "top -=50%",
                end: "bottom -=40%",
                toggleActions: "play none none reverse"
            }
        })
        // Animate vertical lines (left and right) - reveal from top to bottom
        tl.to(verticalEls, {
            clipPath: "inset(0% 0 0 0)",
            duration: 3,
            ease: "power2.out"
        }, "-=1")

        // Expand width of vertical lines after 100vh of scroll
        let leftProgress = 0
        let rightProgress = 0
        let isThinkingVisible = false
        const updateThinkingVisibility = () => {
            if (!thinkingEl) return
            const shouldShow = leftProgress >= 0.999 && rightProgress >= 0.999
            if (shouldShow !== isThinkingVisible) {
                isThinkingVisible = shouldShow
                gsap.to(thinkingEl, { opacity: shouldShow ? 1 : 0, duration: 0.6, ease: "power1.out" })
            }
        }
        const leftMove = leftEl ? gsap.to(leftEl, {
            left: "25%",
            scrollTrigger: {
                trigger: brandsRef.current,
                start: "top -70%",
                end: "top 20%",
                scrub: 1,
                onUpdate: self => { leftProgress = self.progress; updateThinkingVisibility() }
            }
        }) : null
        const rightMove = rightEl ? gsap.to(rightEl, {
            left: "75%",
            scrollTrigger: {
                trigger: brandsRef.current,
                start: "top -70%",
                end: "top -100vh",
                scrub: 1,
                onUpdate: self => { rightProgress = self.progress; updateThinkingVisibility() }
            }
        }) : null

        // Keep Thinking hidden until both line animations complete; toggle on every scroll
        if (thinkingEl) gsap.set(thinkingEl, { opacity: 0 })
        // In case user lands beyond the end positions on load/refresh
        updateThinkingVisibility()

        
    }, [])

  return (
    <div ref={brandsRef} className="relative z-20">
        <div className="sticky top-0 left-0 w-full pointer-events-none">
            <div ref={topLineRef} className="absolute -top-5 left-1/2 -translate-x-1/2">
                <img src="/topEclipse.svg" alt="" />
            </div>
            <div ref={bottomLineRef} className="absolute top-[92vh] left-1/2 -translate-x-1/2">
                <img src="/bottomEclipse.svg" alt="" />
            </div>
            <div ref={leftLineRef} className="absolute top-0 left-1/3">
                <div className="h-screen w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
            </div>
            <div ref={rightLineRef} className="absolute top-0 left-[66%]">
                <div className="h-screen w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
            </div>
        </div>
        <Conversations />
        <div ref={thinkingRef}>
            <Thinking />
        </div>
    </div>
  )
}

export default Brands