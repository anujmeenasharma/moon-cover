import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

export default function ScrambleText({ textSize = "3xl", text, trigger = false }) {
  const textRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // Reset animation state when text changes
  useEffect(() => {
    setHasAnimated(false);
  }, [text]);

  // Force animation when trigger changes
  useEffect(() => {
    if (trigger && textRef.current) {
      setHasAnimated(false);
    }
  }, [trigger]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const words = el.querySelectorAll("span");

    const playScrambleAnimation = () => {
      if (hasAnimated) return;
      
      words.forEach((word, i) => {
        if (!gsap.isTweening(word)) {
          gsap.to(word, {
            scrambleText: {
              text: word.dataset.text, // original word
              speed: 4,
              chars,
            },
            duration: 1,
            ease: "power2.out",
            delay: i * 0.1, // stagger for nice effect
          });
        }
      });
      setHasAnimated(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            playScrambleAnimation();
          }
        });
      },
      {
        threshold: 0.3, 
        rootMargin: "0px 0px -50px 0px", 
      }
    );

    observer.observe(el);

    el.addEventListener('mouseenter', playScrambleAnimation);
    return () => {
      observer.disconnect();
    };
  }, [text, hasAnimated]);

  return (
    <h1
      className={`text-${textSize} uppercase font-bold will-change-transform relative w-full leading-snug`}
      ref={textRef}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} data-text={word} className="inline-block mr-2">
          {word}
        </span>
      ))}
    </h1>
  );
}
