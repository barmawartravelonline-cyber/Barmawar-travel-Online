import React from 'react';
import { POPULAR_DESTINATIONS } from '../data/travelData';
import { Sparkles, ArrowRight, Sun } from 'lucide-react';
import { CurrencyCode, formatCurrencyPrice } from '../utils/currency';

interface DestinationsGridProps {
  onSelectDestination: (destinationName: string) => void;
  currentCurrency: CurrencyCode;
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({ onSelectDestination, currentCurrency }) => {
  return (
    <section className="w-full max-w-7xl mx-auto py-10 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-[#E8E2D9] pb-4">
        <div>
          <span className="text-xs font-bold text-[#C08C5D] uppercase tracking-[0.2em] block mb-1">
            🌟 Handcrafted Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2621]">
            Curated Holidays & AI Tour Expeditions
          </h2>
        </div>
        <p className="text-xs text-stone-500 max-w-sm">
          Select a destination to browse curated packages or generate an AI day-by-day itinerary tailored to your budget in <strong className="text-[#2C2621]">{currentCurrency}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_DESTINATIONS.map((dest) => {
          const startPriceInfo = formatCurrencyPrice(dest.startingPrice, currentCurrency);

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-[#E8E2D9] hover:border-[#C08C5D] transition-all duration-500 shadow-lg bg-[#2C2621]"
            >
              {/* Background Image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2621] via-[#2C2621]/40 to-transparent"></div>

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-[#1F1A16]/90 backdrop-blur-md text-[#C08C5D] font-extrabold text-[10px] px-3 py-1 rounded-full border border-[#C08C5D]/40 uppercase tracking-widest">
                  🔥 {dest.tag}
                </span>
                <span className="bg-[#1F1A16]/90 backdrop-blur-md text-stone-200 font-bold text-[10px] px-2.5 py-1 rounded-full border border-stone-700 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-[#C08C5D]" /> {dest.weather}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#C08C5D] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-medium">{dest.country}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase tracking-wider">From</span>
                    <span className="text-xl font-serif font-black text-[#C08C5D]">{startPriceInfo.formatted}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#C08C5D] group-hover:translate-x-1 transition-transform">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Plan with AI Concierge
                  </span>
                  <span className="bg-[#C08C5D] text-[#2C2621] p-2 rounded-xl transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
