import React, { useState } from 'react';
import { Plane, Building, Compass, Car, Sparkles, Search, Calendar, Users, MapPin } from 'lucide-react';
import { SearchTab } from '../types';

interface SearchWidgetProps {
  activeTab: SearchTab;
  setActiveTab: (tab: SearchTab) => void;
  onSearch: (query: {
    tab: SearchTab;
    origin?: string;
    destination?: string;
    dates?: string;
    guests?: number;
    cabinClass?: string;
  }) => void;
  onGenerateAIItinerary: (destination: string, days: number, budget: string) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  activeTab,
  setActiveTab,
  onSearch,
  onGenerateAIItinerary,
}) => {
  const [origin, setOrigin] = useState('New Delhi');
  const [destination, setDestination] = useState('Dubai');
  const [dates, setDates] = useState('2026-09-15');
  const [guests, setGuests] = useState(2);
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('Moderate');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'ai-planner') {
      onGenerateAIItinerary(destination, days, budget);
    } else {
      onSearch({
        tab: activeTab,
        origin,
        destination,
        dates,
        guests,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#1F1A16] text-[#FDFCF7] border border-[#C08C5D]/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative z-20 -mt-10 sm:-mt-14">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#382F28] pb-4 mb-5">
        {[
          { id: 'packages', label: 'Tour Curations', icon: Compass },
          { id: 'flights', label: 'Flights', icon: Plane },
          { id: 'hotels', label: 'Lodgings & Hotels', icon: Building },
          { id: 'cabs', label: 'Cabs & Transfers', icon: Car },
          { id: 'ai-planner', label: 'AI Concierge Planner', icon: Sparkles, highlight: true },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SearchTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-[#C08C5D] text-[#2C2621] shadow-lg'
                  : 'bg-[#2C2621] text-stone-300 hover:bg-[#382F28] hover:text-white border border-[#382F28]'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.highlight ? 'text-amber-200' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Form depending on tab */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Origin / Destination Fields */}
        {activeTab === 'flights' && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C08C5D]" /> Departure City
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g., Delhi, London, New York"
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C08C5D]"
            />
          </div>
        )}

        <div className={activeTab === 'flights' ? 'space-y-1' : 'space-y-1 sm:col-span-2 lg:col-span-1'}>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#C08C5D]" />
            {activeTab === 'hotels' ? 'City or Hotel' : 'Destination'}
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Dubai, Kashmir, Maldives, Umrah, Paris"
            className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C08C5D]"
            required
          />
        </div>

        {/* Date Selector */}
        {activeTab !== 'ai-planner' ? (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#C08C5D]" /> Travel Date
            </label>
            <input
              type="date"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#C08C5D]" /> Duration
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            >
              {[3, 4, 5, 6, 7, 8, 10, 12, 14, 15].map((d) => (
                <option key={d} value={d}>
                  {d} Days / {d - 1} Nights
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Guests / Budget Selector */}
        {activeTab !== 'ai-planner' ? (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D] flex items-center gap-1">
              <Users className="w-3 h-3 text-[#C08C5D]" /> Guests / Travelers
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            >
              <option value={1}>1 Traveler (Solo)</option>
              <option value={2}>2 Travelers (Couple)</option>
              <option value={4}>4 Travelers (Family/Group)</option>
              <option value={6}>6+ Travelers</option>
            </select>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C08C5D]" /> Tier / Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            >
              <option value="Budget-Friendly">Classic Standard ($)</option>
              <option value="Moderate">Heritage Premium ($$)</option>
              <option value="Luxury & VIP">Royal VIP ($$$)</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C08C5D] hover:bg-amber-600 text-[#2C2621] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {activeTab === 'ai-planner' ? (
              <>
                <Sparkles className="w-4 h-4 text-[#2C2621]" /> Generate AI Itinerary
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-[#2C2621]" /> Search {activeTab.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Destination Chips */}
      <div className="mt-4 pt-3 border-t border-[#382F28] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-stone-400 font-serif italic">Popular Expeditions:</span>
        {['Kashmir', 'Dubai', 'Maldives', 'Umrah Package 15 Days', 'Bali', 'Paris', 'Mecca'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setDestination(chip);
              if (activeTab === 'ai-planner') {
                onGenerateAIItinerary(chip, days, budget);
              } else {
                onSearch({ tab: activeTab, destination: chip });
              }
            }}
            className="px-2.5 py-1 rounded-full bg-[#2C2621] hover:bg-[#C08C5D] text-stone-300 hover:text-[#2C2621] border border-[#382F28] transition-colors text-[11px] font-medium"
          >
            ✨ {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
