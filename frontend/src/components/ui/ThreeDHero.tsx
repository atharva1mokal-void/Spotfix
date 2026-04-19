import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, Shield, Users, Activity, Globe, Zap } from 'lucide-react';

export function ThreeDHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll-linked depth and rotation
  const rotateY = useTransform(scrollY, [0, 500], [0, 25]);
  const rotateX = useTransform(scrollY, [0, 500], [10, -5]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.85]);
  const yOffset = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-[#fdfcfb]">
      
      {/* BACKGROUND DECORATION: RADIATING RINGS */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.1, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: i * 3 }}
            className="absolute border border-saffron/20 rounded-full"
            style={{ width: `${i * 40}vw`, height: `${i * 40}vw` }}
          />
        ))}
      </div>

      {/* 3D SCENE CONTAINER */}
      <div className="relative w-full max-w-7xl mx-auto h-full flex items-center justify-center" style={{ perspective: "2000px" }}>
        
        <motion.div 
          style={{ 
            rotateY: smoothRotateY, 
            rotateX: smoothRotateX, 
            scale: smoothScale,
            y: yOffset,
            transformStyle: "preserve-3d"
          }}
          className="relative flex flex-col items-center justify-center"
        >
          
          {/* THE 3D CORE CARD (SPOTFIX EMBLEM) */}
          <motion.div 
            className="relative z-20"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                {/* Glowing Outer Ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-saffron to-green-600 rounded-[60px] blur-2xl opacity-20 animate-pulse" />
                
                {/* Main Glass Pane */}
                <div className="relative w-full h-full bg-white/80 backdrop-blur-xl border border-white rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center p-10 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron to-green-600" />
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-saffron mb-6"
                    >
                      <MapPin size={120} className="drop-shadow-[0_10px_20px_rgba(255,153,51,0.4)]" />
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black text-navy tracking-tighter uppercase leading-none text-center">
                      Spot<span className="text-saffron">Fix</span>
                    </h1>
                    <p className="mt-4 text-xs font-black text-navy/60 uppercase tracking-[0.4em] text-center">Strategic Resolution Engine</p>
                    
                    {/* Interior depth elements */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-saffron/5 rounded-full blur-3xl" />
                </div>
            </div>
          </motion.div>

          {/* ORBITING NODES (SATURATED COLORS) */}
          <OrbitalNode icon={Shield} color="#000080" label="Authority" x="-180%" y="-30%" delay={0} />
          <OrbitalNode icon={Users} color="#138808" label="Citizen" x="180%" y="-10%" delay={1} />
          <OrbitalNode icon={Zap} color="#FF9933" label="Real-time" x="0%" y="150%" delay={2} />
          <OrbitalNode icon={Globe} color="#FFA500" label="Global" x="-120%" y="100%" delay={3} />

        </motion.div>

        {/* OVERLAY TEXT (IMMERSIVE BUT READABLE) */}
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none"
        >
          <div className="max-w-2xl text-center px-4 space-y-6">
             <motion.h2 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
               className="text-xl md:text-3xl font-black text-navy uppercase tracking-widest leading-none"
             >
               The Future of <span className="ethnic-highlight text-saffron">Civic Defense</span>
             </motion.h2>
             <p className="text-sm md:text-base font-bold text-gray-700 uppercase tracking-[0.2em] leading-relaxed">
               An Executive Infrastructure Platform for <br/> 
               <span className="text-navy">Spot-Fixed <span className="ethnic-highlight">Civil Resolutions</span> & Strategic Oversight.</span>
             </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function OrbitalNode({ icon: Icon, color, x, y, delay, label }: any) {
  return (
    <motion.div 
      className="absolute z-10 hidden md:flex flex-col items-center gap-2"
      style={{ x, y, translateZ: 100 }}
      animate={{ 
        y: [`calc(${y} + 0px)`, `calc(${y} + 25px)`, `calc(${y} + 0px)`],
      }}
      transition={{ 
        duration: 6, 
        delay, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <motion.div 
        whileHover={{ scale: 1.2, rotate: 10 }}
        className="bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 flex items-center justify-center cursor-pointer group hover:border-saffron/50 transition-all bg-white/90 backdrop-blur-md"
      >
        <Icon size={32} style={{ color }} className="group-hover:scale-110 transition-transform" />
      </motion.div>
      <span className="text-[10px] font-black text-navy uppercase tracking-[0.2em] bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">{label}</span>
    </motion.div>
  );
}
