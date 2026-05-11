/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import IdentityMap from './components/IdentityMap';
import BottomNav, { ViewType } from './components/BottomNav';
import BrandsView from './components/BrandsView';
import ProfileView from './components/ProfileView';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

export type MapStyle = 'minimal' | 'vibrant' | 'dark';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('minimal');

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'brands') {
      setSelectedInterestId(null);
    }
  };

  const handleInterestSelect = (id: string) => {
    setSelectedInterestId(id);
    setCurrentView('brands');
  };

  return (
    <div className={cn(
      "w-full h-screen overflow-hidden flex flex-col transition-colors duration-500",
      mapStyle === 'minimal' && "bg-[#F9F9F8]",
      mapStyle === 'vibrant' && "bg-[#FFF5F5]",
      mapStyle === 'dark' && "bg-[#1A1A1A]"
    )}>
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <IdentityMap onInterestClick={handleInterestSelect} mapStyle={mapStyle} />
            </motion.div>
          )}
          {currentView === 'brands' && (
            <motion.div
              key="brands"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0"
            >
              <BrandsView initialInterestId={selectedInterestId} />
            </motion.div>
          )}
          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0"
            >
              <ProfileView currentStyle={mapStyle} onStyleChange={setMapStyle} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <BottomNav currentView={currentView} onViewChange={handleViewChange} />
    </div>
  );
}
