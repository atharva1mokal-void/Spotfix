import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useMotionValue, useSpring as useFramerSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { 
  Eye, 
  ArrowRight, 
  Globe, 
  Activity, 
  Info, 
  HelpCircle, 
  MapPin, 
  Users, 
  ChevronDown,
  Shield,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Navbar, NavItem } from "../../components/ui/Navbar";

/* ──────────────────────────────────────────────
   3D HERO – Orbital rings + mouse-tracking parallax
   ────────────────────────────────────────────── */
function ThreeDHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring-based mouse tracking
  const smoothX = useFramerSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useFramerSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);   // –1 → +1
      mouseY.set((e.clientY - cy) / cy);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // Derive transform values for each parallax layer
  const bg1X = useTransform(smoothX, [-1, 1], [-15, 15]);
  const bg1Y = useTransform(smoothY, [-1, 1], [-15, 15]);
  const bg2X = useTransform(smoothX, [-1, 1], [-30, 30]);
  const bg2Y = useTransform(smoothY, [-1, 1], [-30, 30]);
  const bg3X = useTransform(smoothX, [-1, 1], [-50, 50]);
  const bg3Y = useTransform(smoothY, [-1, 1], [-50, 50]);

  // Stable particle positions (computed once)
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      dur: 5 + Math.random() * 7,
      delay: Math.random() * 4,
    }))
  );

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
      {/* LAYER 1 – Outer orbital ring (slow) */}
      <motion.div
        style={{ x: bg1X, y: bg1Y }}
        className="absolute w-[700px] h-[700px] md:w-[900px] md:h-[900px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-dashed border-accent/10 rounded-full"
        />
        {/* Orbiting node */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-4 h-4 rounded-full bg-accent/30 shadow-[0_0_20px_rgba(255,153,51,0.3)]" />
        </motion.div>
      </motion.div>

      {/* LAYER 2 – Middle orbital ring */}
      <motion.div
        style={{ x: bg2X, y: bg2Y }}
        className="absolute w-[450px] h-[450px] md:w-[600px] md:h-[600px]"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-accent-secondary/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <div className="w-3 h-3 rounded-full bg-accent-secondary/40 shadow-[0_0_15px_rgba(19,136,8,0.3)]" />
        </motion.div>
      </motion.div>

      {/* LAYER 3 – Inner glow core */}
      <motion.div
        style={{ x: bg3X, y: bg3Y }}
        className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-accent/15 rounded-full"
        />
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-accent/10 to-accent-secondary/10 blur-2xl" />
      </motion.div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.45, 0.15],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-accent/25"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   LANDING PAGE
   ────────────────────────────────────────────── */
export function LandingPage() {
  const { t, i18n } = useTranslation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Language cycling: en → hi → mr → en
  const langCycle = { en: "hi", hi: "mr", mr: "en" } as Record<string, string>;
  const langLabels: Record<string, string> = { en: "English", hi: "हिंदी", mr: "मराठी" };

  const navItems: NavItem[] = [
    { label: t("Features"), href: "#features", icon: Info, type: 'hash' },
    { label: t("How It Works"), href: "#how-it-works", icon: HelpCircle, type: 'hash' },
    { label: t("Impact"), href: "#impact", icon: Activity, type: 'hash' },
    { 
      label: langLabels[i18n.language] || "English", 
      href: "#", 
      icon: Globe, 
      isButton: true,
      onClick: () => i18n.changeLanguage(langCycle[i18n.language] || "en")
    },
  ];

  // Scroll-driven parallax for the hero text
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="bg-bg-primary min-h-screen font-sans selection:bg-accent/30 overflow-x-hidden transition-colors duration-500 relative ethnic-pattern">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent to-accent-secondary z-[1000] origin-left shadow-sm" style={{ scaleX }} />

      <Navbar items={navItems} />

      {/* ═══════════ 3D HERO SECTION ═══════════ */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <ThreeDHero />
        
        {/* Dynamic Typography Overlay – parallax on scroll */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center px-4 mb-20"
          >
            <h2 className="text-[10px] md:text-sm font-black text-accent uppercase tracking-[0.8em] mb-8 opacity-80">Urban Governance Infrastructure</h2>
            <div className="inline-block relative">
              <h1 className="text-[5rem] md:text-[10rem] font-black text-text-primary/90 tracking-tighter leading-none mb-6 select-none whitespace-nowrap drop-shadow-2xl">
                SPOTFIX
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-accent-secondary to-accent rounded-full blur-sm opacity-50" />
            </div>
            <p className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] max-w-2xl mx-auto mt-12 leading-relaxed opacity-70">
              Bridging the gap between <span className="text-accent">Civic Participation</span> and <br className="hidden md:block" /> <span className="text-accent-secondary">Operational Excellence</span>.
            </p>
          </motion.div>
        </motion.div>

        {/* Hero Bottom Stats Ticker */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute bottom-16 left-0 right-0 z-20 overflow-hidden py-4 bg-black/5 backdrop-blur-sm border-y border-white/5"
        >
          <div className="flex items-center gap-12 animate-infinite-scroll whitespace-nowrap">
            {[
              { l: "Reports Resolved", v: "12,482" },
              { l: "Active Citizens", v: "45,000+" },
              { l: "Cities Covered", v: "150+" },
              { l: "Resolution Time", v: "48 Hours" },
              { l: "Citizen Karma Points", v: "1.2 Million" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">{s.l}</span>
                <span className="text-lg font-black text-accent">{s.v}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary/40 mx-4" />
              </div>
            ))}
            {/* Duplicate for infinite scroll */}
            {[
              { l: "Reports Resolved", v: "12,482" },
              { l: "Active Citizens", v: "45,000+" },
              { l: "Cities Covered", v: "150+" },
              { l: "Resolution Time", v: "48 Hours" },
              { l: "Citizen Karma Points", v: "1.2 Million" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">{s.l}</span>
                <span className="text-lg font-black text-accent">{s.v}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary/40 mx-4" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA buttons - now a single prominent action */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-30 flex flex-col items-center gap-8 mt-48 pointer-events-auto"
        >
          <button 
            onClick={() => document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth' })}
            className="group h-14 md:h-16 px-8 md:px-12 bg-card-bg/50 backdrop-blur-xl border border-card-border text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-white/10 hover:-translate-y-1 transition-all flex items-center gap-6"
          >
            Access Governance Portals <ChevronDown className="group-hover:translate-y-1 transition-transform" size={16} />
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -ml-3 text-accent z-20"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* ═══════════ PORTALS SECTION ═══════════ */}
      <section id="portals" className="container mx-auto px-6 py-32 relative z-20">
        <div className="text-center mb-20 space-y-4">
          <h3 className="text-xs font-black text-accent uppercase tracking-[0.4em]">Choose your portal</h3>
          <h2 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter">SELECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">PORTAL</span></h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          <PortalCard title={t("Citizen Portal")} desc="Speak up. Report issues in your area with exact location and track them live." link="/login/citizen" icon={Users} color="saffron" />
          <PortalCard title={t("Authority Portal")} desc="Work together. Manage tasks in the field, verify fixes, and update status." link="/login/authority" icon={Shield} color="navy" />
          <PortalCard title={t("Admin Portal")} desc="Stay informed. Monitor city progress with simple charts and management tools." link="/login/admin" icon={Activity} color="green" />
        </motion.div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section id="features" className="bg-card-bg/40 backdrop-blur-3xl py-40 border-y border-card-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader title={t("Features")} subtitle="Professional Civic Solutions" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-24">
            <FeatureItem icon={MapPin} title="Smart Mapping" desc="Automatic location tagging ensures the right team gets to the right spot quickly." />
            <FeatureItem icon={Activity} title="Instant Updates" desc="Our system ensures you see every update as your report moves toward resolution." />
            <FeatureItem icon={Shield} title="Safe & Secure" desc="Top-level security ensures your data and your city's info stay protected." />
          </div>
        </div>
      </section>

      {/* ═══════════ PROCESS WALKTHROUGH ═══════════ */}
      <section id="how-it-works" className="py-40 relative">
        <div className="container mx-auto px-6 text-center">
          <SectionHeader title="Process Overview" subtitle={t("How It Works")} />
            
          <div className="mt-24 flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-6xl mx-auto">
            {[
              { n: "01", t: "Report", d: "Capture the issue with date, time, and exact location." },
              { n: "02", t: "Assign", d: "Our system sends the task to the nearest field agent." },
              { n: "03", t: "Fix", d: "Authorities perform the fix and verify it with a photo." },
              { n: "04", t: "Done", d: "Final checks are done and you receive an update." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex-1 bg-card-bg/60 backdrop-blur-xl p-10 rounded-[40px] border border-card-border flex flex-col items-center gap-6 group hover:translate-y-[-10px] transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
              >
                <span className="text-5xl font-black text-text-primary/10 group-hover:text-accent/20 transition-colors">{step.n}</span>
                <h4 className="text-lg font-black text-text-primary uppercase tracking-tight">{step.t}</h4>
                <p className="text-sm font-bold text-text-secondary uppercase tracking-widest leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ IMPACT / STATS ═══════════ */}
      <section id="impact" className="bg-card-bg/40 backdrop-blur-3xl py-40 border-y border-card-border">
        <div className="container mx-auto px-6 text-center">
          <SectionHeader title={t("Impact")} subtitle="Platform Metrics" />
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "12K+", label: "Reports Resolved" },
              { value: "95%", label: "Success Rate" },
              { value: "48h", label: "Avg. Resolution Time" },
              { value: "150+", label: "Cities Connected" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[32px] bg-card-bg border border-card-border group hover:-translate-y-2 transition-all"
              >
                <div className="text-4xl md:text-5xl font-black text-accent tracking-tight mb-3">{stat.value}</div>
                <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="container mx-auto px-6 py-40 text-center">
        <div className="p-16 md:p-32 bg-card-bg/60 backdrop-blur-2xl text-text-primary rounded-[60px] relative overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.05)] border border-card-border">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-secondary/10 rounded-full blur-[100px]" />
            
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Ready to <span className="text-accent">Resolve?</span></h2>
            <p className="text-xl font-bold text-text-secondary uppercase tracking-widest mb-12">Building Cleaner Cities together, one report at a time.</p>
            <Link to="/login/citizen">
              <Button className="h-20 px-16 bg-gradient-to-r from-accent to-accent-secondary text-white rounded-[30px] text-lg font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto">
                Start Reporting <ArrowRight size={24} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-20 border-t border-card-border text-center relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4">
              <Eye className="text-accent" size={32} />
              <span className="font-black text-3xl text-text-primary uppercase tracking-tighter">SpotFix 2026</span>
            </div>
            <p className="max-w-2xl text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] leading-relaxed">
              Digital Governance System • Part of Digital India movement • Safe and Secure
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────── */

function PortalCard({ title, desc, link, icon: Icon, color }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useFramerSpring(x, { stiffness: 150, damping: 20 });
  const springY = useFramerSpring(y, { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((event.clientX - cx) / 8);
    y.set((event.clientY - cy) / 8);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const colorStyles: Record<string, string> = { 
    saffron: 'text-accent group-hover:bg-accent', 
    green: 'text-accent-secondary group-hover:bg-accent-secondary', 
    navy: 'text-text-primary group-hover:bg-text-primary' 
  };
  
  return (
    <Link to={link}>
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        whileHover={{ scale: 1.02 }}
        className="bg-card-bg backdrop-blur-xl p-10 rounded-[40px] border border-card-border h-full flex flex-col gap-6 group hover:shadow-2xl hover:border-accent transition-all cursor-pointer"
      >
        <div className={`w-16 h-16 rounded-2xl bg-bg-primary border border-card-border flex items-center justify-center ${colorStyles[color]} group-hover:text-white transition-all duration-500 shadow-sm`}>
          <Icon size={32} />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">{title}</h3>
          <p className="text-xs font-black text-text-secondary uppercase tracking-widest leading-loose">{desc}</p>
        </div>
        <div className="mt-auto pt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-accent translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          Open Portal <ArrowRight size={18} />
        </div>
      </motion.div>
    </Link>
  );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-6 group"
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:shadow-lg transition-all duration-500">
        <Icon size={32} />
      </div>
      <div>
        <h4 className="text-xl font-black text-text-primary uppercase tracking-tight mb-3">{title}</h4>
        <p className="text-xs font-black text-text-secondary uppercase tracking-widest leading-loose">{desc}</p>
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center space-y-6 mb-4"
    >
      <span className="text-sm font-black text-accent uppercase tracking-[0.5em] block">{subtitle}</span>
      <h2 className="text-6xl md:text-8xl font-black text-text-primary uppercase tracking-tighter leading-none">
        {title}
      </h2>
    </motion.div>
  );
}