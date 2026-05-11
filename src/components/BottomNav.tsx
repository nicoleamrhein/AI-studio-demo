import React from 'react';
import { Map, LayoutGrid, User } from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewType = 'map' | 'brands' | 'profile';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'map' as ViewType, label: 'Map', icon: Map },
    { id: 'brands' as ViewType, label: 'Brands', icon: LayoutGrid },
    { id: 'profile' as ViewType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-black scale-110" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-colors",
                isActive ? "bg-gray-100" : "bg-transparent"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
