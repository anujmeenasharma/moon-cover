import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// Vertical scroll progress with clickable points and hover tooltips
// Props:
// - sectionIds: string[] of element IDs in scroll order
// - toolTipNames: string[] labels aligned to points (optional)
// - className: optional wrapper classes
// - offsetStart, offsetEnd: ScrollTrigger start/end strings (optional)
const VerticalScrollProgress = ({
  sectionIds = [],
  toolTipNames = [],
  className = '',
  offsetStart = 'top center',
  offsetEnd = 'bottom center',
  barHeight = '28vh',
  position = 'right-center', // 'right-center' | 'bottom-left'
  tooltipSide = 'left', // 'left' | 'right'
}) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const progressBarRef = useRef(null)
  const progressFillRef = useRef(null)
  const triggersRef = useRef([])

  const numSections = sectionIds.length

  // Derived percentages for each point
  const points = useMemo(() => {
    if (numSections <= 1) return []
    return new Array(numSections).fill(0).map((_, idx) => ({
      index: idx,
      topPct: (idx / (numSections - 1)) * 100,
    }))
  }, [numSections])

  useEffect(() => {
    // cleanup old
    triggersRef.current.forEach(t => t.kill && t.kill())
    triggersRef.current = []

    if (!numSections) return

    sectionIds.forEach((id, index) => {
      const trigger = ScrollTrigger.create({
        trigger: `#${id}`,
        start: offsetStart,
        end: offsetEnd,
        onEnter: () => {
          setCurrentSection(index)
          const p = index / (numSections - 1)
          if (progressFillRef.current) progressFillRef.current.style.height = `${p * 100}%`
        },
        onEnterBack: () => {
          setCurrentSection(index)
          const p = index / (numSections - 1)
          if (progressFillRef.current) progressFillRef.current.style.height = `${p * 100}%`
        },
      })
      triggersRef.current.push(trigger)
    })

    // Ensure 100% at the end of last section bottom
    if (sectionIds[numSections - 1]) {
      const endTrigger = ScrollTrigger.create({
        trigger: `#${sectionIds[numSections - 1]}`,
        start: 'bottom center',
        end: 'bottom bottom',
        onEnter: () => {
          setCurrentSection(numSections - 1)
          if (progressFillRef.current) progressFillRef.current.style.height = '100%'
        },
      })
      triggersRef.current.push(endTrigger)
    }

    return () => {
      triggersRef.current.forEach(t => t.kill && t.kill())
      triggersRef.current = []
    }
  }, [sectionIds, numSections, offsetStart, offsetEnd])

  const handlePointClick = (index) => {
    if (index < 0 || index >= numSections) return
    const el = document.getElementById(sectionIds[index])
    if (!el) return
    const y = el.offsetTop
    gsap.to(window, {
      duration: 1.6,
      scrollTo: { y, autoKill: true },
      ease: 'power2.inOut',
    })
  }

  const wrapperPositionClass = position === 'bottom-left'
    ? 'left-8 bottom-8'
    : 'right-8 top-1/2 -translate-y-1/2'

  const renderTooltip = (label) => {
    if (!label) return null
    if (tooltipSide === 'right') {
      return (
        <div className="absolute left-full ml-2 -translate-y-1/2 clash bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-white/20 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black/90" />
        </div>
      )
    }
    return (
      <div className="absolute left-0 -translate-x-full -translate-y-1/2 clash bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-white/20 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
        {label}
        <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/90" />
      </div>
    )
  }

  return (
    <div className={`pointer-events-none fixed z-40 ${wrapperPositionClass} ${className}`}>
      <div
        ref={progressBarRef}
        className="relative w-[1px] bg-white/20 overflow-visible"
        style={{ height: barHeight }}
      >
        {/* Background gradient line */}
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-black/10 via-white to-black/10"></div>

        {/* Progress fill (vertical) */}
        <div
          ref={progressFillRef}
          className="absolute left-0 top-0 w-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-500 ease-out"
          style={{ height: '0%' }}
        />

        {/* Points */}
        {points.map(({ index, topPct }) => {
          const isEdge = index === 0 || index === numSections - 1
          if (isEdge) return null
          const isActive = index <= currentSection
          const isHovered = hoveredIndex === index
          return (
            <div key={index} className="absolute left-0" style={{ top: `${topPct}%` }}>
              {/* Large invisible hover/click area */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] pointer-events-auto cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handlePointClick(index)}
              />
              {/* Dot */}
              <div
                className={`absolute left-0 top-0 rounded-full border transition-all duration-300 pointer-events-none ${
                  isActive || isHovered
                    ? 'w-[10px] h-[10px] border-white bg-white shadow-[0_0_12px_rgba(255,255,255,1)]'
                    : 'w-[3px] h-[3px] bg-white border-white/50'
                }`}
                style={{ transform: `translate(-50%, -50%) scale(${isHovered ? 1.05 : 0.5})` }}
              />
              {/* Tooltip */}
              {isHovered && renderTooltip(toolTipNames[index - 1])}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VerticalScrollProgress


