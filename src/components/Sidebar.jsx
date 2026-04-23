import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fa-solid fa-chart-pie' },
    { name: 'Find Skills', path: '/find-skills', icon: 'fa-solid fa-users' },
    { name: 'Community', path: '/community', icon: 'fa-solid fa-comments' },
    { name: 'Courses', path: '/courses', icon: 'fa-solid fa-graduation-cap' },
    { name: 'Gamification', path: '/gamification', icon: 'fa-solid fa-trophy' },
  ];

  return (
    <aside className="w-64 border-r border-base-border bg-base-bg flex flex-col h-full hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-base-border">
        <h1 className="font-heading font-bold text-xl text-text-primary tracking-tight">
          Skill<span className="text-primary">Circle</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-base-surface hover:text-text-primary'
              }`
            }
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile Snippet */}
      <div className="p-4 border-t border-base-border">
        <div className="flex items-center gap-3 px-2 py-2 hover:bg-base-surface rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-base-surface flex items-center justify-center border border-base-border overflow-hidden">
             <i className="fa-solid fa-user text-text-secondary text-xs"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">Settings</span>
            <span className="text-xs text-text-secondary">Manage account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
