// src/shared/components/Layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Scan, User, Plus } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/virtual', icon: Map, label: 'Virtual' },
    { path: '/scan', icon: Scan, label: 'Scan' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="hidden md:block w-64 bg-background-card/50 backdrop-blur-md border-r border-primary min-h-screen fixed left-0 top-16">
      <div className="p-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary/20'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;