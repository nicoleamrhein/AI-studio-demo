import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ExternalLink, ArrowLeft, Search } from 'lucide-react';
import { MOCK_DATA, Interest, Brand } from '../data/mockData';
import { cn } from '../lib/utils';

interface BrandsViewProps {
  initialInterestId?: string | null;
}

export default function BrandsView({ initialInterestId }: BrandsViewProps) {
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    initialInterestId ? MOCK_DATA.find(i => i.id === initialInterestId) || null : null
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInterests = MOCK_DATA.filter(interest => 
    interest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInterestClick = (interest: Interest) => {
    setSelectedInterest(interest);
  };

  const handleBack = () => {
    setSelectedInterest(null);
  };

  return (
    <div className="h-full bg-[#F9F9F8] overflow-y-auto pb-24">
      <AnimatePresence mode="wait">
        {!selectedInterest ? (
          <motion.div
            key="interest-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 pt-12"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-serif font-black tracking-tighter uppercase mb-2">Interests</h1>
              <p className="text-gray-500 font-medium">Explore brands by your core values</p>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>

            <div className="grid gap-4">
              {filteredInterests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestClick(interest)}
                  className="group relative flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-black/10 transition-all text-left overflow-hidden"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-2" 
                    style={{ backgroundColor: interest.color }} 
                  />
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-1">{interest.label}</h3>
                    <p className="text-sm text-gray-400">{interest.brands.length} Brands</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="brand-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 pt-12"
          >
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to Interests</span>
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedInterest.color }} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{selectedInterest.label}</span>
              </div>
              <h1 className="text-4xl font-serif font-black tracking-tighter uppercase">Curated Brands</h1>
            </div>

            <div className="grid gap-6">
              {selectedInterest.brands.map((brand) => (
                <div 
                  key={brand.id}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
                        <span className="text-3xl font-serif font-bold" style={{ color: selectedInterest.color }}>
                          {brand.logo}
                        </span>
                      </div>
                      <a 
                        href={brand.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-bold mb-3">{brand.name}</h2>
                    <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                      {brand.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {brand.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-5 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors">
                    View Full Profile
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
