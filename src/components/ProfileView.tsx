import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Map as MapIcon, Heart, Bell, Shield, LogOut, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { MOCK_DATA, Interest } from '../data/mockData';
import { cn } from '../lib/utils';

interface ProfileViewProps {
  currentStyle: 'minimal' | 'vibrant' | 'dark';
  onStyleChange: (style: 'minimal' | 'vibrant' | 'dark') => void;
}

export default function ProfileView({ currentStyle, onStyleChange }: ProfileViewProps) {
  const [activeInterests, setActiveInterests] = useState<Interest[]>(MOCK_DATA);

  const mapStyles = [
    { id: 'minimal', label: 'Minimal', color: '#F9F9F8' },
    { id: 'vibrant', label: 'Vibrant', color: '#FFF5F5' },
    { id: 'dark', label: 'Deep', color: '#1A1A1A' },
  ];

  const handleRemoveInterest = (id: string) => {
    setActiveInterests(activeInterests.filter(i => i.id !== id));
  };

  return (
    <div className="h-full bg-[#F9F9F8] overflow-y-auto pb-24">
      <div className="p-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-black tracking-tighter uppercase">Profile</h1>
          <button className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-xl">
            <span className="text-2xl font-serif italic font-bold text-white">Y</span>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold">You</h2>
            <p className="text-sm text-gray-400 font-medium tracking-tight">Identity Explorer v1.0</p>
          </div>
        </div>

        {/* Map Customization */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <MapIcon size={18} className="text-gray-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Map Customization</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => onStyleChange(style.id as any)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                  currentStyle === style.id 
                    ? "bg-black text-white border-black shadow-lg" 
                    : "bg-white text-black border-gray-100 hover:border-black/10"
                )}
              >
                <div 
                  className="w-8 h-8 rounded-full border border-gray-200 shadow-inner" 
                  style={{ backgroundColor: style.color }} 
                />
                <span className="text-[10px] font-bold uppercase tracking-widest">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests Management */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-gray-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Interests</h3>
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-black flex items-center gap-1 hover:opacity-70 transition-opacity">
              <Plus size={14} /> Add New
            </button>
          </div>
          <div className="grid gap-3">
            {activeInterests.map((interest) => (
              <div
                key={interest.id}
                className="group flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: interest.color }} />
                  <span className="text-sm font-bold tracking-tight">{interest.label}</span>
                </div>
                <button 
                  onClick={() => handleRemoveInterest(interest.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Other Settings */}
        <div className="grid gap-3">
          {[
            { icon: Bell, label: 'Notifications' },
            { icon: Shield, label: 'Privacy & Security' },
            { icon: LogOut, label: 'Sign Out', color: 'text-red-500' },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={cn("text-gray-400", item.color)} />
                <span className={cn("text-sm font-bold tracking-tight", item.color)}>{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
