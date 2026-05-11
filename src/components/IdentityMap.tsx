import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { MOCK_DATA, Interest, Brand } from '../data/mockData';
import { cn } from '../lib/utils';

interface Node {
  id: string;
  label: string;
  type: 'center' | 'interest' | 'brand';
  x: number;
  y: number;
  color?: string;
  parentId?: string;
  data?: any;
}

interface IdentityMapProps {
  onInterestClick: (id: string) => void;
  mapStyle: 'minimal' | 'vibrant' | 'dark';
}

export default function IdentityMap({ onInterestClick, mapStyle }: IdentityMapProps) {
  const [expandedInterestId, setExpandedInterestId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set([MOCK_DATA[0].id, MOCK_DATA[1].id]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isDark = mapStyle === 'dark';

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const centerX = 1000; // Fixed large canvas center
  const centerY = 1000;
  const canvasSize = 2000;

  // Calculate responsive radius
  const baseRadius = dimensions.width > 0 
    ? Math.min(dimensions.width, dimensions.height) * 0.28 
    : 260;

  // Calculate positions for interest nodes
  const interestNodes: Node[] = MOCK_DATA.map((interest, index) => {
    const angle = (index / MOCK_DATA.length) * 2 * Math.PI;
    const radius = baseRadius; 
    
    return {
      id: interest.id,
      label: interest.label,
      type: 'interest',
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      color: interest.color,
      data: interest,
    };
  });

  // Calculate positions for brand nodes if an interest is expanded
  const brandNodes: Node[] = [];
  if (expandedInterestId) {
    const interest = MOCK_DATA.find((i) => i.id === expandedInterestId);
    const interestNode = interestNodes.find((n) => n.id === expandedInterestId);
    
    if (interest && interestNode) {
      const brands = interest.brands;
      brands.forEach((brand, index) => {
        const angle = (index / brands.length) * 2 * Math.PI;
        const radius = Math.max(70, dimensions.width * 0.12); 
        brandNodes.push({
          id: brand.id,
          label: brand.name,
          type: 'brand',
          x: interestNode.x + Math.cos(angle) * radius,
          y: interestNode.y + Math.sin(angle) * radius,
          color: interest.color,
          parentId: interest.id,
          data: brand,
        });
      });
    }
  }

  const handleInterestClick = (id: string) => {
    setExpandedInterestId(expandedInterestId === id ? null : id);
  };

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only collapse if clicking the background, not dragging
    if (e.target === e.currentTarget) {
      setExpandedInterestId(null);
    }
  };

  const handleDrag = (_: any, info: any) => {
    setDragOffset({ x: info.point.x, y: info.point.y });
    
    // Discovery logic: Check which nodes are near the viewport center
    const viewportCenterX = dimensions.width / 2;
    const viewportCenterY = dimensions.height / 2;
    
    // We need to translate the node coordinates to viewport coordinates
    // nodeViewportX = nodeCanvasX + currentCanvasX
    // info.offset is the relative drag, but we need the absolute position of the canvas
    // Actually, motion provides the current x/y in the style or we can use a ref
  };

  // Improved discovery logic using a ref to track the canvas position
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const newDiscovered = new Set(discoveredIds);
      let changed = false;

      interestNodes.forEach(node => {
        if (newDiscovered.has(node.id)) return;

        // Calculate node position in viewport
        const nodeViewportX = rect.left + node.x;
        const nodeViewportY = rect.top + node.y;

        const dist = Math.sqrt(
          Math.pow(nodeViewportX - viewportCenterX, 2) + 
          Math.pow(nodeViewportY - viewportCenterY, 2)
        );

        // If node is within 300px of viewport center, discover it
        if (dist < 350) {
          newDiscovered.add(node.id);
          changed = true;
        }
      });

      if (changed) {
        setDiscoveredIds(newDiscovered);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [discoveredIds, interestNodes]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full h-full overflow-hidden transition-colors duration-700",
        mapStyle === 'minimal' && "bg-[#FDFCF0]", 
        mapStyle === 'vibrant' && "bg-[#E0F2F1]", 
        mapStyle === 'dark' && "bg-[#050B14]" 
      )}
    >
      {/* Draggable Map Canvas */}
      <motion.div 
        ref={canvasRef}
        key={dimensions.width > 0 ? 'ready' : 'loading'}
        drag
        dragConstraints={{
          left: -(canvasSize - dimensions.width),
          right: 0,
          top: -(canvasSize - dimensions.height),
          bottom: 0
        }}
        dragElastic={0.2}
        dragMomentum={true}
        initial={{ 
          x: -centerX + (dimensions.width || 1000) / 2, 
          y: -centerY + (dimensions.height || 1000) / 2 
        }}
        animate={{
          x: -centerX + dimensions.width / 2,
          y: -centerY + dimensions.height / 2
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        onClick={handleBackgroundClick}
        className="absolute cursor-grab active:cursor-grabbing"
        style={{ width: canvasSize, height: canvasSize }}
      >
        {/* Physical Map Background Layer */}
        <div className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-1000",
          isDark ? "opacity-30" : "opacity-60"
        )}>
          {/* Subtle Paper Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 mix-blend-multiply" />
          
          <svg width="100%" height="100%" viewBox={`0 0 ${canvasSize} ${canvasSize}`} preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke={isDark ? "#4A90E2" : "#2C5282"} strokeWidth="1" opacity="0.3"/>
              </pattern>
              <pattern id="subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isDark ? "#4A90E2" : "#2C5282"} strokeWidth="0.5" opacity="0.15"/>
              </pattern>
            </defs>
            
            {/* Base Paper Layer */}
            <rect width="100%" height="100%" fill={isDark ? "#0A1220" : "#FDFCF0"} />
            
            {/* Grids */}
            <rect width="100%" height="100%" fill="url(#subgrid)" />
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Fold Lines (Physical Map Feel) */}
            <line x1={canvasSize/2} y1="0" x2={canvasSize/2} y2={canvasSize} stroke={isDark ? "white" : "black"} strokeWidth="0.5" opacity="0.1" />
            <line x1="0" y1={canvasSize/2} x2={canvasSize} y2={canvasSize/2} stroke={isDark ? "white" : "black"} strokeWidth="0.5" opacity="0.1" />
            
            {/* Coordinate Labels */}
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={`coord-${i}`}>
                <text 
                  x={i * 200 + 10} 
                  y="20" 
                  className="text-[10px] font-mono opacity-40" 
                  fill={isDark ? "#4A90E2" : "#2C5282"}
                >
                  {String(i * 200).padStart(4, '0')}
                </text>
                <text 
                  x="10" 
                  y={i * 200 + 20} 
                  className="text-[10px] font-mono opacity-40" 
                  fill={isDark ? "#4A90E2" : "#2C5282"}
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {String(i * 200).padStart(4, '0')}
                </text>
              </React.Fragment>
            ))}
            
            {/* Topographic Lines */}
            {[...Array(20)].map((_, i) => (
              <path
                key={`topo-${i}`}
                d={`M ${i * 100} 0 Q ${500 + i * 50} ${400 + i * 20} ${i * 100} ${canvasSize}`}
                fill="none"
                stroke={isDark ? "#4A90E2" : "#2C5282"}
                strokeWidth="1"
                strokeDasharray={i % 4 === 0 ? "" : "5 10"}
                opacity={0.12 - (i * 0.004)}
              />
            ))}
            
            {/* Compass Rose Placeholder */}
            <g transform={`translate(${centerX - 300}, ${centerY - 300})`} opacity="0.3">
              <circle cx="0" cy="0" r="80" fill="none" stroke={isDark ? "#4A90E2" : "#2C5282"} strokeWidth="1" />
              <path d="M -100 0 L 100 0 M 0 -100 L 0 100" stroke={isDark ? "#4A90E2" : "#2C5282"} strokeWidth="0.5" />
              <text x="0" y="-110" textAnchor="middle" className="text-[10px] font-bold" fill={isDark ? "#4A90E2" : "#2C5282"}>N</text>
              <text x="110" y="5" textAnchor="middle" className="text-[10px] font-bold" fill={isDark ? "#4A90E2" : "#2C5282"}>E</text>
            </g>
          </svg>
        </div>

        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />
              <stop offset="100%" stopColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"} />
            </linearGradient>
          </defs>
          
          {/* Connections from Center to Interests */}
          {interestNodes.map((node) => (
            <motion.path
              key={`path-${node.id}`}
              d={`M ${centerX} ${centerY} Q ${(centerX + node.x) / 2} ${(centerY + node.y) / 2 - 40} ${node.x} ${node.y}`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: discoveredIds.has(node.id) ? 1 : 0, 
                opacity: discoveredIds.has(node.id) ? 1 : 0 
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          ))}

          {/* Inter-Interest Connections (Network Effect) */}
          {interestNodes.map((node, i) => {
            const nextNode = interestNodes[(i + 1) % interestNodes.length];
            const isBothDiscovered = discoveredIds.has(node.id) && discoveredIds.has(nextNode.id);
            
            return (
              <motion.path
                key={`network-${node.id}-${nextNode.id}`}
                d={`M ${node.x} ${node.y} Q ${(node.x + nextNode.x) / 2 + 20} ${(node.y + nextNode.y) / 2 + 20} ${nextNode.x} ${nextNode.y}`}
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: isBothDiscovered ? 1 : 0, 
                  opacity: isBothDiscovered ? 1 : 0 
                }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            );
          })}

          {/* Connections from Interest to Brands */}
          <AnimatePresence>
            {brandNodes.map((node) => {
              const parent = interestNodes.find(n => n.id === node.parentId);
              if (!parent) return null;
              return (
                <motion.line
                  key={`line-brand-${node.id}`}
                  x1={parent.x}
                  y1={parent.y}
                  x2={node.x}
                  y2={node.y}
                  stroke={node.color}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center Node */}
          <motion.div
            className="absolute z-20 flex items-center justify-center pointer-events-auto"
            style={{ left: centerX, top: centerY, x: '-50%', y: '-50%' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <motion.div 
                className={cn(
                  "absolute inset-0 rounded-full blur-2xl opacity-30",
                  isDark ? "bg-white" : "bg-black"
                )}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className={cn(
                "relative rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 border-8",
                isDark ? "bg-white border-white/20" : "bg-white border-black/5"
              )}
              style={{ 
                width: Math.max(120, dimensions.width * 0.15), 
                height: Math.max(120, dimensions.width * 0.15) 
              }}>
                <span className="text-[12px] font-mono uppercase tracking-[0.3em] text-gray-400 mb-1">Origin</span>
                <span className="text-3xl md:text-4xl font-serif italic font-black text-black">You</span>
              </div>
            </div>
          </motion.div>

          {/* Interest Nodes */}
          {interestNodes.map((node, index) => (
            <motion.button
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                handleInterestClick(node.id);
              }}
              className={cn(
                "absolute z-10 flex items-center justify-center pointer-events-auto",
                expandedInterestId === node.id ? "z-30" : "z-10"
              )}
              style={{ left: node.x, top: node.y, x: '-50%', y: '-50%' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: discoveredIds.has(node.id) ? 1 : 0,
                opacity: discoveredIds.has(node.id) ? 1 : 0,
                y: discoveredIds.has(node.id) ? [0, index % 2 === 0 ? 12 : -12, 0] : 0,
              }}
              transition={{ 
                scale: { type: 'spring', damping: 12 },
                y: { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1, zIndex: 40 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className={cn(
                  "px-8 py-4 md:px-12 md:py-6 rounded-[2rem] md:rounded-[3rem] border-2 transition-all duration-500 flex items-center gap-3 md:gap-5 backdrop-blur-xl shadow-2xl",
                  expandedInterestId === node.id 
                    ? (isDark ? "bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.4)]" : "bg-black text-white border-black")
                    : (isDark ? "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/30" : "bg-white/90 text-black border-gray-100 hover:border-black/20")
                )}
              >
                <motion.div 
                  className="w-3 h-3 md:w-5 md:h-5 rounded-full shadow-lg" 
                  style={{ backgroundColor: node.color }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <span className="text-xs md:text-base font-black uppercase tracking-[0.15em]">{node.label}</span>
              </div>
            </motion.button>
          ))}

          {/* Brand Nodes */}
          <AnimatePresence>
            {brandNodes.map((node, index) => (
              <motion.button
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrandClick(node.data);
                }}
                className="absolute z-20 flex items-center justify-center pointer-events-auto"
                style={{ left: node.x, top: node.y, x: '-50%', y: '-50%' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.25, rotate: 8 }}
                whileTap={{ scale: 0.85 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 30,
                  delay: index * 0.05 
                }}
              >
                <div 
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.25rem] bg-white shadow-2xl flex items-center justify-center transition-all duration-300 border-2",
                    isDark ? "border-white/10 hover:border-white" : "border-gray-50 hover:border-black"
                  )}
                >
                  <span className="text-xl md:text-2xl font-serif font-black" style={{ color: node.color }}>
                    {node.data.logo}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Brand Profile Modal */}
      <AnimatePresence>
        {selectedBrand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
            onClick={() => setSelectedBrand(null)}
          >
            <motion.div
              initial={{ y: 100, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 100, scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56 bg-gray-50 flex items-center justify-center">
                <button 
                  onClick={() => setSelectedBrand(null)}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white shadow-sm transition-all"
                >
                  <X size={20} />
                </button>
                <div className="w-28 h-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center border border-gray-50">
                   <span className="text-6xl font-serif font-black text-black">{selectedBrand.logo}</span>
                </div>
              </div>
              
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl font-serif font-black tracking-tight">{selectedBrand.name}</h2>
                  <a 
                    href={selectedBrand.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
                
                <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                  {selectedBrand.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-10">
                  {selectedBrand.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest rounded-full border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-gray-900 transition-all group shadow-xl">
                  Explore Collection
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding / Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "backdrop-blur-2xl px-10 py-5 rounded-full border shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-5 transition-colors duration-500",
            isDark ? "bg-white/10 border-white/10" : "bg-white/95 border-gray-100"
          )}
        >
          <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isDark ? "bg-white" : "bg-black")} />
          <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDark ? "text-white/70" : "text-gray-600")}>
            {expandedInterestId ? "Tap to collapse • Explore to discover" : "Tap to expand • Explore to discover"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
