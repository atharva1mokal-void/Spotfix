import React from 'react';
import { NavLink } from 'react-router';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
  isButton?: boolean;
  type?: 'route' | 'hash';
}

interface NavbarProps {
  items: NavItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ items }) => {
  return (
    <div className="menu-wrapper">
      <nav className="menu">
        {items.map((item, index) => {
          if (item.isButton) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="nav-btn"
              >
                <item.icon />
                <span>{item.label}</span>
              </button>
            );
          }
          
          if (item.type === 'hash') {
            return (
              <a
                key={index}
                href={item.href}
              >
                <item.icon />
                <span>{item.label}</span>
              </a>
            );
          }
          
          return (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
