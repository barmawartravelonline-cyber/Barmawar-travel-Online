import React from 'react';
import { Compass, Mic, Phone, Mail, Ticket, Globe, Sparkles, User, ChevronDown } from 'lucide-react';
import { SearchTab } from '../types';
import { CurrencyCode, CURRENCIES } from '../utils/currency';

interface HeaderProps {
  activeTab: SearchTab;
  setActiveTab: (tab: SearchTab) => void;
  onOpenVoiceAssistant: () => void;
  isVoiceActive: boolean;
  onOpenMyBookings: () => void;
  bookingsCount: number;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenVoiceAssistant,
  isVoiceActive,
  onOpenMyBookings,
  bookingsCount,
  currentCurrency,
  onCurrencyChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#2C2621] text-[#FDFCF7] border-b border-[#3D352E] shadow-xl">
      {/* Top Banner: Owner Info, Support & Currency Converter Dropdown */}
      <div className="bg-[#1F1A16] text-xs py-2 px-4 sm:px-8 border-b border-[#382F28]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Owner & Contact */}
          <div className="flex flex-wrap items-center gap-4 text-[#D8D0C5] text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-[#C08C5D]" />
              <span className="text-[#E8E2D9]">Company Owner:</span>
              <strong className="text-white font-serif tracking-wide">Syed Abdul Munyeem Barmawar</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C08C5D]" />
              <a href="tel:9731831122" className="text-[#F5EFE6] font-bold hover:text-[#C08C5D] transition-colors">
                +91 9731831122
              </a>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#C08C5D]" />
              <span className="text-stone-300">barmawartravelonline@gmail.com</span>
            </span>
          </div>

          {/* Right Status & Currency Dropdown */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#2C2621] text-[#C08C5D] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#C08C5D]/30 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini Live Concierge
            </span>

            {/* Real-time Currency Converter Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#2C2621] border border-[#C08C5D]/40 rounded-lg px-2.5 py-1 text-xs text-[#FDFCF7] shadow-sm hover:border-[#C08C5D] transition-all">
              <Globe className="w-3.5 h-3.5 text-[#C08C5D]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C08C5D] hidden xs:inline">Currency:</span>
              <select
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                aria-label="Select Currency"
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-[#2C2621] text-white">
                    {curr.flag} {curr.code} ({curr.symbol.trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('packages')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full border border-[#C08C5D] bg-[#1F1A16] flex items-center justify-center text-[#C08C5D] group-hover:bg-[#C08C5D] group-hover:text-[#2C2621] transition-all duration-300 shadow-md">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif italic font-light tracking-tight text-white group-hover:text-[#C08C5D] transition-colors">
                Barmawar
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] bg-[#1F1A16] text-[#C08C5D] font-bold px-2 py-0.5 rounded border border-[#C08C5D]/30">
                Heritage Travels
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
              Syed Abdul Munyeem Barmawar • Est. 1924
            </p>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#1F1A16] p-1.5 rounded-xl border border-[#382F28]">
          {[
            { id: 'packages', label: 'Tour Curations' },
            { id: 'flights', label: 'Flights' },
            { id: 'hotels', label: 'Lodgings & Hotels' },
            { id: 'cabs', label: 'Transfers & Cabs' },
            { id: 'ai-planner', label: 'AI Itinerary', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SearchTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#C08C5D] text-[#2C2621] shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-[#2C2621]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-amber-300" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Voice Assistant & My Bookings */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenVoiceAssistant}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
              isVoiceActive
                ? 'bg-rose-700 text-white border-rose-400 animate-pulse'
                : 'bg-[#1F1A16] text-[#C08C5D] border-[#C08C5D]/50 hover:bg-[#C08C5D] hover:text-[#2C2621]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Concierge</span>
            <span className="sm:hidden">Voice AI</span>
          </button>

          <button
            onClick={onOpenMyBookings}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1F1A16] hover:bg-[#382F28] text-[#FDFCF7] border border-[#382F28] transition-all flex items-center gap-2 relative"
          >
            <Ticket className="w-4 h-4 text-[#C08C5D]" />
            <span className="hidden sm:inline">Bookings</span>
            {bookingsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C08C5D] text-[#2C2621] font-black text-[10px] flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
