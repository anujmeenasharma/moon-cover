import React, { useRef } from 'react';
import { useTransform, motion, useScroll } from 'framer-motion';

const Card = ({ i, title, description, src, url, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{
          top: `calc(-12vh + ${i * 120}px)`,
          borderTop: '20px solid #0B0B0C',
        }} 
        className="flex relative -top-1/4 h-[40vh] w-[40vw] max-w-[90vw] rounded-[50px] p-12 origin-top flex-col gap-4 justify-center items-center backdrop-blur-3xl overflow-hidden shadow-lg"
      >
        <div className='absolute top-10 left-10'>
          <img src="/arrowTopRight.svg" alt={title} width={20} height={20} />
        </div>
        <div className='absolute bottom-0 left-0'>
          <img src="/cardIcon.svg" alt={title} width={250} height={250} />
        </div>
        <h1 className={`telegraf text-5xl uppercase font-bold text-center`} style={{ color: color }}>
          {title}
        </h1>
        <p className='text-lg font-light text-center max-w-lg'>
          {description}
        </p>
      </motion.div>
    </div>
  );
};

export default Card;