import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import { LucideIcon, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
  isButton?: boolean;
  type?: 'route' | 'hash';
  subItems?: Omit<NavItem, 'subItems'>[];
}

interface NavbarProps {
  items: NavItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderDesktopItem = (item: NavItem, index: number) => {
    const isActive = location.pathname === item.href;
    const baseClasses = cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300",
      isActive 
        ? "bg-accent/10 text-accent antigravity-shadow border border-accent/20" 
        : "text-text-secondary hover:text-accent hover:bg-card-bg/50 hover-antigravity"
    );

    const content = (
      <>
        <item.icon className={cn("w-4 h-4", isActive && "chaos-bob")} />
        <span>{item.label}</span>
      </>
    );

    if (item.subItems && item.subItems.length > 0) {
      return (
        <DropdownMenu key={index}>
          <DropdownMenuTrigger className={cn(baseClasses, "outline-none")}>
            {content}
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-panel border-accent/20 z-[110]">
            {item.subItems.map((subItem, subIdx) => (
              <DropdownMenuItem key={subIdx} className="hover-antigravity cursor-pointer my-1">
                {subItem.type === 'hash' ? (
                  <a href={subItem.href} className="flex items-center gap-2 w-full" onClick={subItem.onClick}>
                    <subItem.icon className="w-4 h-4 text-accent" />
                    <span className="font-bold tracking-wider">{subItem.label}</span>
                  </a>
                ) : (
                  <NavLink to={subItem.href} className="flex items-center gap-2 w-full" onClick={subItem.onClick}>
                    <subItem.icon className="w-4 h-4 text-accent" />
                    <span className="font-bold tracking-wider">{subItem.label}</span>
                  </NavLink>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.isButton) {
      return (
        <button key={index} onClick={item.onClick} className={baseClasses}>
          {content}
        </button>
      );
    }
    
    if (item.type === 'hash') {
      return (
        <a key={index} href={item.href} className={baseClasses}>
          {content}
        </a>
      );
    }
    
    return (
      <NavLink key={index} to={item.href} className={baseClasses}>
        {content}
      </NavLink>
    );
  };

  const renderMobileItem = (item: NavItem, index: number) => {
    return (
      <div key={index} className="flex flex-col gap-2">
        {item.type === 'hash' ? (
          <a href={item.href} className="flex items-center gap-3 p-4 rounded-xl text-text-primary hover:bg-accent/10 transition-colors" onClick={() => { item.onClick?.(); setMobileMenuOpen(false); }}>
            <item.icon className="w-5 h-5 text-accent" />
            <span className="font-bold uppercase tracking-widest">{item.label}</span>
          </a>
        ) : (
          <button onClick={() => { item.onClick?.(); if(!item.subItems) setMobileMenuOpen(false); }} className="w-full">
            {item.isButton ? (
               <div className="flex items-center gap-3 p-4 rounded-xl text-text-primary hover:bg-accent/10 transition-colors">
                 <item.icon className="w-5 h-5 text-accent" />
                 <span className="font-bold uppercase tracking-widest">{item.label}</span>
               </div>
            ) : (
               <NavLink to={item.href} className="flex items-center gap-3 p-4 rounded-xl text-text-primary hover:bg-accent/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                 <item.icon className="w-5 h-5 text-accent" />
                 <span className="font-bold uppercase tracking-widest">{item.label}</span>
               </NavLink>
            )}
          </button>
        )}
        {item.subItems?.map((sub, sIdx) => (
           <NavLink key={`sub-${sIdx}`} to={sub.href} className="flex items-center gap-3 p-3 ml-6 rounded-xl text-text-secondary hover:bg-accent/5 hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
             <sub.icon className="w-4 h-4" />
             <span className="text-sm font-semibold uppercase tracking-widest">{sub.label}</span>
           </NavLink>
        ))}
      </div>
    );
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled ? "py-2" : "py-6"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 cursor-default">
        <motion.nav 
          className={cn(
            "mx-auto max-w-5xl rounded-[2.5rem] flex items-center justify-between px-4 sm:px-6 py-3 transition-all duration-500",
            isScrolled 
              ? "glass-panel antigravity-shadow bg-card-bg/60 backdrop-blur-2xl border border-card-border" 
              : "bg-transparent border border-transparent"
          )}
        >
          <div className="flex-1 md:hidden"></div>

          <div className="hidden md:flex items-center justify-center gap-2 flex-wrap flex-1">
            {items.map((item, i) => renderDesktopItem(item, i))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block pl-4 border-l border-card-border/50">
              <ThemeToggle />
            </div>
            
            <button 
              className="md:hidden p-2 text-text-primary glass-panel rounded-xl hover-antigravity transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className={cn("transition-transform duration-300", mobileMenuOpen ? "rotate-90" : "")}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </div>
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute top-full left-4 right-4 sm:left-6 sm:right-6 mt-4 glass-panel bg-card-bg/95 p-6 rounded-3xl flex flex-col gap-2 md:hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] z-[105]"
            >
              {items.map((item, i) => renderMobileItem(item, i))}
              <div className="pt-4 mt-2 border-t border-card-border/50 flex justify-center">
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
