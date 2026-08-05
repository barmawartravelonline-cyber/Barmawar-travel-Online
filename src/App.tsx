import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchWidget } from './components/SearchWidget';
import { SearchResults } from './components/SearchResults';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { DestinationsGrid } from './components/DestinationsGrid';
import { LiveVoiceAssistant } from './components/LiveVoiceAssistant';
import { BookingModal } from './components/BookingModal';
import { MyBookings } from './components/MyBookings';
import { Footer } from './components/Footer';
import { SearchTab, FlightOption, HotelOption, PackageOption, CabOption, Booking } from './types';
import { CurrencyCode } from './utils/currency';
import { Sparkles, Compass, ShieldCheck, Phone, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<SearchTab>('packages');
  const [searchFilter, setSearchFilter] = useState<{
    destination?: string;
    origin?: string;
    dates?: string;
    guests?: number;
  }>({ destination: '' });

  // Real-Time Currency Converter State
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');

  // Voice assistant modal
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<{
    type: 'flight' | 'hotel' | 'package' | 'cab';
    title: string;
    subtitle: string;
    price: number;
    currency: string;
  } | null>(null);

  // My Bookings
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [bookingsList, setBookingsList] = useState<Booking[]>([
    {
      id: 'BK-984210',
      type: 'package',
      pnr: 'BTO-KSHMIR',
      itemTitle: 'Magical Kashmir: Lakes, Snow & Houseboats (5 Nights)',
      subtitle: 'Includes Dal Lake Houseboat Stay & Gondola Cable Car Ride',
      details: { Customer: 'Rahul Sharma', Status: 'CONFIRMED' },
      passengerName: 'Rahul Sharma',
      passengerEmail: 'barmawartravelonline@gmail.com',
      passengerPhone: '+91 9731831122',
      totalAmount: 499,
      currency: '$',
      bookingDate: '2026-08-01',
      travelDate: '2026-09-15',
      status: 'Confirmed',
      paymentMethod: 'Instant Credit Card',
      qrData: 'PNR:BTO-KSHMIR',
    },
  ]);

  const handleSearch = (filter: any) => {
    setActiveTab(filter.tab);
    setSearchFilter(filter);
  };

  const handleGenerateAIItinerary = (dest: string, days: number, budget: string) => {
    setActiveTab('ai-planner');
    setSearchFilter({ destination: dest });
  };

  // Triggers for booking checkout
  const handleSelectFlight = (fl: FlightOption) => {
    setBookingItem({
      type: 'flight',
      title: `${fl.airline} ${fl.flightNumber}: ${fl.fromCode} → ${fl.toCode}`,
      subtitle: `${fl.departureTime} departure • ${fl.duration} (${fl.stops})`,
      price: fl.price,
      currency: fl.currency,
    });
    setIsBookingOpen(true);
  };

  const handleSelectHotel = (ht: HotelOption) => {
    setBookingItem({
      type: 'hotel',
      title: ht.name,
      subtitle: `${ht.roomType} • ${ht.location}`,
      price: ht.pricePerNight,
      currency: ht.currency,
    });
    setIsBookingOpen(true);
  };

  const handleSelectPackage = (pkg: PackageOption) => {
    setBookingItem({
      type: 'package',
      title: pkg.title,
      subtitle: `${pkg.durationDays} Days / ${pkg.durationNights} Nights in ${pkg.destination}`,
      price: pkg.price,
      currency: pkg.currency,
    });
    setIsBookingOpen(true);
  };

  const handleSelectCab = (cab: CabOption) => {
    setBookingItem({
      type: 'cab',
      title: `${cab.category} - ${cab.carModel}`,
      subtitle: `Up to ${cab.passengers} Passengers • Professional Chauffeur`,
      price: cab.estimatedPrice,
      currency: cab.currency,
    });
    setIsBookingOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookingsList((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#2C2621] font-sans selection:bg-[#C08C5D] selection:text-[#2C2621]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
        isVoiceActive={isVoiceActive}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        bookingsCount={bookingsList.length}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
      />

      {/* Hero Banner - Artistic Flair Theme */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden bg-[#2C2621] text-[#FDFCF7] border-b border-[#3D352E]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2621] via-[#2C2621]/80 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#1F1A16] border border-[#C08C5D]/40 text-[#C08C5D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4 text-[#C08C5D]" />
            Heritage Expeditions & Gemini AI Concierge
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Journey Beyond Boundaries with <br className="hidden sm:inline" />
            <span className="italic text-[#C08C5D]">
              Barmawar Travel Online
            </span>
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-light">
            Owned & Operated by <strong className="text-white font-serif">Syed Abdul Munyeem Barmawar</strong> (Call: <strong className="text-[#C08C5D]">+91 9731831122</strong>). Reserve tour packages, flights, hotels, Umrah packages, and cabs with live multi-currency prices.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#C08C5D] hover:bg-amber-600 text-[#2C2621] font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
            >
              🎙️ Voice AI Concierge
            </button>

            <button
              onClick={() => setActiveTab('ai-planner')}
              className="px-5 py-2.5 rounded-xl bg-[#1F1A16] hover:bg-[#382F28] text-stone-200 font-bold text-xs border border-[#382F28] uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C08C5D]" /> Custom AI Expedition
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 space-y-12 pb-16">
        {/* Universal Search Widget */}
        <SearchWidget
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSearch={handleSearch}
          onGenerateAIItinerary={handleGenerateAIItinerary}
        />

        {/* Dynamic Main View */}
        {activeTab === 'ai-planner' ? (
          <ItineraryPlanner
            initialDestination={searchFilter.destination || 'Kashmir'}
            onBookAsPackage={handleSelectPackage}
            currentCurrency={currentCurrency}
          />
        ) : (
          <SearchResults
            activeTab={activeTab}
            searchFilter={searchFilter}
            currentCurrency={currentCurrency}
            onSelectFlight={handleSelectFlight}
            onSelectHotel={handleSelectHotel}
            onSelectPackage={handleSelectPackage}
            onSelectCab={handleSelectCab}
          />
        )}

        {/* Popular Destinations Showcase Grid */}
        <DestinationsGrid
          currentCurrency={currentCurrency}
          onSelectDestination={(dest) => {
            setSearchFilter({ destination: dest });
            setActiveTab('packages');
          }}
        />
      </main>

      {/* Gemini Live Multimodal Voice Assistant Overlay */}
      <LiveVoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSelectFlight={handleSelectFlight}
        onSelectHotel={handleSelectHotel}
        onSelectPackage={handleSelectPackage}
      />

      {/* Booking & E-Ticket Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingItem={bookingItem}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* My Bookings Drawer */}
      <MyBookings
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookingsList}
        onOpenTicketVoucher={(b) => {
          setBookingItem({
            type: b.type,
            title: b.itemTitle,
            subtitle: b.subtitle,
            price: b.totalAmount,
            currency: b.currency,
          });
          setIsBookingOpen(true);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
