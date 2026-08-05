import React from 'react';
import { Compass, Phone, Mail, MapPin, ShieldCheck, User, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F1A16] border-t border-[#382F28] text-stone-400 py-12 px-4 sm:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#C08C5D] bg-[#2C2621] flex items-center justify-center text-[#C08C5D]">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-white text-xl tracking-tight">BARMAWAR TRAVEL</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Heritage travel curations, Umrah packages, flight tickets, luxury stays, and AI multimodal voice concierge.
          </p>
          <div className="space-y-1 pt-1 text-xs">
            <p className="text-[#C08C5D] font-serif italic">
              <strong>Company Owner:</strong> Syed Abdul Munyeem Barmawar
            </p>
            <p className="text-stone-300 text-[11px]">
              <strong>Helper:</strong> Hassan Ikkeri
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Government & IATA Certified
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 text-xs">
          <h4 className="font-serif font-bold text-white text-sm mb-3">Popular Expeditions</h4>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Umrah Packages (15 Days Best Price)</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Dubai Luxury Tours</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Kashmir Paradise Getaways</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Maldives Overwater Villas</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Mecca & Medina Special Curations</p>
        </div>

        {/* Services */}
        <div className="space-y-2 text-xs">
          <h4 className="font-serif font-bold text-white text-sm mb-3">Travel Services</h4>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Flight Ticket Reservations</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Luxury Hotel & Resort Bookings</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Chauffeur Cabs & Transfers</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Real-Time Currency Converter</p>
          <p className="hover:text-[#C08C5D] cursor-pointer transition-colors">Gemini Live Voice Concierge</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs">
          <h4 className="font-serif font-bold text-white text-sm mb-3">Customer Support</h4>
          <p className="flex items-center gap-2 text-stone-300">
            <User className="w-4 h-4 text-[#C08C5D] shrink-0" />
            <strong className="text-white">Syed Abdul Munyeem Barmawar</strong>
          </p>
          <p className="flex items-center gap-2 text-stone-300">
            <Phone className="w-4 h-4 text-[#C08C5D] shrink-0" />
            <a href="tel:9731831122" className="text-white font-bold hover:text-[#C08C5D] transition-colors">
              +91 9731831122
            </a>
          </p>
          <p className="flex items-center gap-2 text-stone-300">
            <Mail className="w-4 h-4 text-[#C08C5D] shrink-0" />
            <span>barmawartravelonline@gmail.com</span>
          </p>
          <p className="flex items-center gap-2 text-stone-400">
            <MapPin className="w-4 h-4 text-[#C08C5D] shrink-0" />
            <span>Barmawar Travel Online Headquarters</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#382F28] flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
        <p>© {new Date().getFullYear()} Barmawar Travel Online. Managed by Syed Abdul Munyeem Barmawar & Hassan Ikkeri.</p>
        <div className="flex items-center gap-4 text-stone-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#C08C5D]" /> 256-Bit SSL Encrypted
          </span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};
