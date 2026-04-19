import React, { useMemo } from 'react';

const PARTICLE_COUNT = 200;

export const ParticleBackground: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const circleSize = Math.floor(Math.random() * 10) + 1;
      const startPositionY = Math.floor(Math.random() * 10) + 100;
      const moveDuration = Math.floor(Math.random() * 4000) + 7000;
      const animationDelay = Math.floor(Math.random() * 11000);
      const circleDelay = Math.floor(Math.random() * 4000);
      
      const startX = Math.floor(Math.random() * 100);
      const endX = Math.floor(Math.random() * 100);
      const endY = -(startPositionY + Math.floor(Math.random() * 30));
      
      return {
        id: i,
        style: {
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          animationDuration: `${moveDuration}ms`,
          animationDelay: `${animationDelay}ms`,
          // @ts-ignore
          '--start-x': `${startX}vw`,
          // @ts-ignore
          '--start-y': `${startPositionY}vh`,
          // @ts-ignore
          '--end-x': `${endX}vw`,
          // @ts-ignore
          '--end-y': `${endY}vh`,
        } as React.CSSProperties,
        circleStyle: {
          animationDelay: `${circleDelay}ms`,
        } as React.CSSProperties,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div key={p.id} className="circle-container" style={p.style}>
          <div className="circle" style={p.circleStyle} />
        </div>
      ))}
    </div>
  );
};
