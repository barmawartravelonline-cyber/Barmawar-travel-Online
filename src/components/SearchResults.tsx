import React, { useState } from 'react';
import { Plane, Building, Compass, Car, Star, Check, ArrowRight, MapPin, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { FlightOption, HotelOption, PackageOption, CabOption, SearchTab } from '../types';
import { MOCK_FLIGHTS, MOCK_HOTELS, MOCK_PACKAGES, MOCK_CABS } from '../data/travelData';
import { CurrencyCode, formatCurrencyPrice } from '../utils/currency';

interface SearchResultsProps {
  activeTab: SearchTab;
  searchFilter?: {
    destination?: string;
    origin?: string;
    dates?: string;
    guests?: number;
  };
  currentCurrency: CurrencyCode;
  onSelectFlight: (flight: FlightOption) => void;
  onSelectHotel: (hotel: HotelOption) => void;
  onSelectPackage: (pkg: PackageOption) => void;
  onSelectCab: (cab: CabOption) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  activeTab,
  searchFilter,
  currentCurrency,
  onSelectFlight,
  onSelectHotel,
  onSelectPackage,
  onSelectCab,
}) => {
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'rating'>('recommended');

  const filterText = searchFilter?.destination?.toLowerCase() || '';

  // Filter packages
  const filteredPackages = MOCK_PACKAGES.filter(
    (pkg) => !filterText || pkg.destination.toLowerCase().includes(filterText) || pkg.title.toLowerCase().includes(filterText)
  ).sort((a, b) => (sortBy === 'priceAsc' ? a.price - b.price : b.rating - a.rating));

  // Filter flights
  const filteredFlights = MOCK_FLIGHTS.filter(
    (fl) => !filterText || fl.toCity.toLowerCase().includes(filterText) || fl.fromCity.toLowerCase().includes(filterText)
  ).sort((a, b) => (sortBy === 'priceAsc' ? a.price - b.price : a.duration.localeCompare(b.duration)));

  // Filter hotels
  const filteredHotels = MOCK_HOTELS.filter(
    (ht) => !filterText || ht.city.toLowerCase().includes(filterText) || ht.name.toLowerCase().includes(filterText)
  ).sort((a, b) => (sortBy === 'priceAsc' ? a.pricePerNight - b.pricePerNight : b.rating - a.rating));

  // Filter cabs
  const filteredCabs = MOCK_CABS.sort((a, b) => (sortBy === 'priceAsc' ? a.estimatedPrice - b.estimatedPrice : b.pricePerKm - a.pricePerKm));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 py-6 px-4">
      {/* Results Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-5 shadow-sm">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#2C2621] capitalize flex items-center gap-2">
            {activeTab === 'packages' && <Compass className="w-5 h-5 text-[#C08C5D]" />}
            {activeTab === 'flights' && <Plane className="w-5 h-5 text-[#C08C5D]" />}
            {activeTab === 'hotels' && <Building className="w-5 h-5 text-[#C08C5D]" />}
            {activeTab === 'cabs' && <Car className="w-5 h-5 text-[#C08C5D]" />}
            Available {activeTab} Options
            {searchFilter?.destination && (
              <span className="text-xs bg-[#F5EFE6] text-[#C08C5D] font-bold px-3 py-1 rounded-full border border-[#E8E2D9]">
                "{searchFilter.destination}"
              </span>
            )}
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Prices dynamically converted in <strong className="text-[#2C2621]">{currentCurrency}</strong> • Guaranteed rate e-vouchers & 24/7 support
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-[#2C2621] flex items-center gap-1 font-bold uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C08C5D]" /> Sort By:
          </label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#2C2621] focus:outline-none focus:border-[#C08C5D]"
          >
            <option value="recommended">Barmawar Heritage Choice</option>
            <option value="priceAsc">Lowest Price First</option>
            <option value="rating">Top Rated First</option>
          </select>
        </div>
      </div>

      {/* 1. TOUR PACKAGES VIEW */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const priceInfo = formatCurrencyPrice(pkg.price, currentCurrency);
            const origPriceInfo = formatCurrencyPrice(pkg.originalPrice, currentCurrency);

            return (
              <div
                key={pkg.id}
                className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl overflow-hidden hover:border-[#C08C5D] hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2621]/90 via-[#2C2621]/20 to-transparent"></div>

                  {pkg.tag && (
                    <span className="absolute top-3 left-3 bg-[#C08C5D] text-[#2C2621] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                      {pkg.tag}
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-[#2C2621]/80 backdrop-blur-md px-2.5 py-1 rounded-lg font-semibold border border-white/10">
                      🗓️ {pkg.durationDays} Days / {pkg.durationNights} Nights
                    </span>
                    <span className="flex items-center gap-1 bg-[#C08C5D] text-[#2C2621] px-2 py-0.5 rounded-lg font-extrabold">
                      ★ {pkg.rating}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C08C5D] uppercase tracking-widest block mb-1">
                      📍 {pkg.destination}, {pkg.country}
                    </span>
                    <h4 className="font-serif font-bold text-[#2C2621] text-lg leading-snug group-hover:text-[#C08C5D] transition-colors">
                      {pkg.title}
                    </h4>

                    {/* Inclusions */}
                    <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                      {pkg.inclusions.slice(0, 3).map((inc, i) => (
                        <p key={i} className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-[#C08C5D] shrink-0" />
                          <span className="truncate">{inc}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block line-through">
                        {origPriceInfo.formatted}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-black text-[#2C2621]">
                          {priceInfo.formatted}
                        </span>
                        <span className="text-[10px] text-stone-500 font-semibold">/ person</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onSelectPackage({
                          ...pkg,
                          price: priceInfo.amount,
                          currency: priceInfo.symbol,
                        })
                      }
                      className="bg-[#2C2621] hover:bg-[#C08C5D] text-white hover:text-[#2C2621] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      Reserve <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. FLIGHTS VIEW */}
      {activeTab === 'flights' && (
        <div className="space-y-4">
          {filteredFlights.map((fl) => {
            const priceInfo = formatCurrencyPrice(fl.price, currentCurrency);

            return (
              <div
                key={fl.id}
                className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-5 hover:border-[#C08C5D] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
              >
                {/* Airline details */}
                <div className="flex items-center gap-4">
                  <img src={fl.airlineLogo} alt={fl.airline} className="w-12 h-12 rounded-xl object-cover bg-white p-1 border border-[#E8E2D9]" />
                  <div>
                    <h4 className="font-serif font-bold text-[#2C2621] text-base">{fl.airline}</h4>
                    <span className="text-xs text-stone-500 font-mono">{fl.flightNumber} • {fl.cabinClass}</span>
                  </div>
                </div>

                {/* Times & Stops */}
                <div className="flex items-center gap-6 sm:gap-10 text-center w-full md:w-auto justify-between md:justify-center border-y md:border-y-0 border-[#E8E2D9] py-3 md:py-0">
                  <div>
                    <p className="text-base font-bold text-[#2C2621]">{fl.departureTime}</p>
                    <p className="text-xs font-bold text-[#C08C5D]">{fl.fromCode} ({fl.fromCity})</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-500 font-medium">{fl.duration}</span>
                    <div className="w-24 sm:w-32 h-0.5 bg-[#C08C5D] relative flex items-center justify-center">
                      <Plane className="w-3.5 h-3.5 text-[#2C2621] absolute" />
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">{fl.stops}</span>
                  </div>

                  <div>
                    <p className="text-base font-bold text-[#2C2621]">{fl.arrivalTime}</p>
                    <p className="text-xs font-bold text-[#C08C5D]">{fl.toCode} ({fl.toCity})</p>
                  </div>
                </div>

                {/* Price & Book */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-serif font-black text-[#2C2621]">{priceInfo.formatted}</span>
                    <span className="text-[10px] text-stone-500 block">{fl.baggage}</span>
                  </div>

                  <button
                    onClick={() =>
                      onSelectFlight({
                        ...fl,
                        price: priceInfo.amount,
                        currency: priceInfo.symbol,
                      })
                    }
                    className="bg-[#2C2621] hover:bg-[#C08C5D] text-white hover:text-[#2C2621] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    Book Flight
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. HOTELS VIEW */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotels.map((ht) => {
            const priceInfo = formatCurrencyPrice(ht.pricePerNight, currentCurrency);

            return (
              <div
                key={ht.id}
                className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl overflow-hidden hover:border-[#C08C5D] transition-all flex flex-col sm:flex-row shadow-sm"
              >
                <img src={ht.image} alt={ht.name} className="w-full sm:w-48 h-48 sm:h-auto object-cover" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#C08C5D] flex items-center gap-1">
                        {'★'.repeat(ht.stars)} Luxury Hotel
                      </span>
                      <span className="bg-[#F5EFE6] text-[#2C2621] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#E8E2D9]">
                        ⭐ {ht.rating} ({ht.reviewsCount})
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-[#2C2621] text-lg mt-1">{ht.name}</h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C08C5D]" /> {ht.location}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ht.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded border border-[#E8E2D9]">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <span className="text-xl font-serif font-black text-[#2C2621]">{priceInfo.formatted}</span>
                      <span className="text-[10px] text-stone-500"> / night</span>
                    </div>

                    <button
                      onClick={() =>
                        onSelectHotel({
                          ...ht,
                          pricePerNight: priceInfo.amount,
                          currency: priceInfo.symbol,
                        })
                      }
                      className="bg-[#2C2621] hover:bg-[#C08C5D] text-white hover:text-[#2C2621] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CABS VIEW */}
      {activeTab === 'cabs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCabs.map((cab) => {
            const priceInfo = formatCurrencyPrice(cab.estimatedPrice, currentCurrency);

            return (
              <div key={cab.id} className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-5 space-y-4 shadow-sm">
                <img src={cab.image} alt={cab.carModel} className="w-full h-36 object-cover rounded-xl" />
                <div>
                  <span className="bg-[#F5EFE6] text-[#C08C5D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#E8E2D9] uppercase tracking-wider">
                    {cab.category}
                  </span>
                  <h4 className="font-serif font-bold text-[#2C2621] text-base mt-1.5">{cab.carModel}</h4>
                  <p className="text-xs text-stone-500">
                    Up to {cab.passengers} Passengers • {cab.luggageCount} Luggage Bags
                  </p>
                </div>

                <div className="space-y-1 text-xs text-stone-600 border-t border-[#E8E2D9] pt-3">
                  {cab.features.map((feat, i) => (
                    <p key={i} className="flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-[#C08C5D]" /> {feat}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#E8E2D9] pt-3">
                  <div>
                    <span className="text-xl font-serif font-black text-[#2C2621]">{priceInfo.formatted}</span>
                    <span className="text-[10px] text-stone-500 block">Est. Fare</span>
                  </div>

                  <button
                    onClick={() =>
                      onSelectCab({
                        ...cab,
                        estimatedPrice: priceInfo.amount,
                        currency: priceInfo.symbol,
                      })
                    }
                    className="bg-[#2C2621] hover:bg-[#C08C5D] text-white hover:text-[#2C2621] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all"
                  >
                    Book Cab
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
