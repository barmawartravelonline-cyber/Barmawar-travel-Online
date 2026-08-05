import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Clock, ExternalLink, Bookmark, Check, ShieldCheck, Compass } from 'lucide-react';
import { GeneratedItinerary, PackageOption } from '../types';
import { CurrencyCode, formatCurrencyPrice } from '../utils/currency';

interface ItineraryPlannerProps {
  initialDestination?: string;
  initialDays?: number;
  initialBudget?: string;
  onBookAsPackage: (pkg: PackageOption) => void;
  currentCurrency: CurrencyCode;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  initialDestination = 'Kashmir',
  initialDays = 5,
  initialBudget = 'Moderate',
  onBookAsPackage,
  currentCurrency,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [days, setDays] = useState(initialDays);
  const [budget, setBudget] = useState(initialBudget);
  const [travelStyle, setTravelStyle] = useState('Balanced Explorer');
  const [group, setGroup] = useState('Couple');
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [groundingSources, setGroundingSources] = useState<{ title: string; url: string }[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const basePackagePrice = 699;
  const convertedPackagePrice = formatCurrencyPrice(basePackagePrice, currentCurrency);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!destination.trim()) return;

    setIsLoading(true);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          budget,
          travelStyle,
          group,
        }),
      });

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
        setGroundingSources(data.groundingSources || []);
      }
    } catch (err) {
      console.error("Failed to generate itinerary:", err);
      // Fallback
      setItinerary({
        destination,
        durationDays: days,
        totalEstimatedCost: `${formatCurrencyPrice(days * 120, currentCurrency).formatted} - ${formatCurrencyPrice(days * 200, currentCurrency).formatted} per person`,
        bestTimeToVisit: 'March to October',
        tripOverview: `A handcrafted ${days}-day expedition to explore the heritage landmarks, local bazaars, and scenic vistas of ${destination}.`,
        days: Array.from({ length: days }, (_, i) => ({
          dayNumber: i + 1,
          title: `Day ${i + 1}: Discovering ${destination} Highlights`,
          summary: `Explore popular cultural landmarks and famous viewpoints in ${destination}.`,
          activities: [
            {
              time: '09:00 AM',
              title: `Morning Heritage Tour in ${destination}`,
              description: 'Guided visit to historic landmarks and gardens with local expert guide.',
              location: `${destination} Central Square`,
              estimatedCost: formatCurrencyPrice(20, currentCurrency).formatted,
              category: 'sightseeing',
            },
            {
              time: '01:00 PM',
              title: 'Authentic Local Culinary Experience',
              description: 'Enjoy traditional regional dishes at top-rated local restaurant.',
              location: 'Culinary Lane',
              estimatedCost: formatCurrencyPrice(25, currentCurrency).formatted,
              category: 'food',
            },
            {
              time: '04:30 PM',
              title: 'Sunset Scenic Viewpoint Walk',
              description: 'Panoramic photo opportunities and artisan souvenir shopping.',
              location: 'Sunset Point',
              estimatedCost: 'Complimentary',
              category: 'leisure',
            },
          ],
        })),
        packingTips: ['Comfortable walking footwear', 'Seasonally appropriate attire', 'Portable power bank & camera'],
        localCuisineToTry: ['Signature Heritage Specialty', 'Traditional Spiced Tea', 'Local Street Food Delicacy'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Title Header */}
      <div className="bg-[#1F1A16] border border-[#C08C5D]/40 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl text-[#FDFCF7]">
        <div className="inline-flex items-center gap-2 bg-[#2C2621] border border-[#C08C5D]/40 text-[#C08C5D] px-3.5 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#C08C5D]" />
          AI Heritage Architect • Gemini Concierge
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Design Your Personal <span className="text-[#C08C5D] italic">Travel Expedition</span>
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
          Tell our AI where you wish to journey. We curate routes, real-time pricing in <strong className="text-white">{currentCurrency}</strong>, weather insights, and local secrets.
        </p>

        {/* Input Controls */}
        <form onSubmit={handleGenerate} className="mt-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D]">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kashmir, Dubai, Paris"
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D]">Duration</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            >
              {[3, 4, 5, 6, 7, 8, 10, 14, 15].map((d) => (
                <option key={d} value={d}>
                  {d} Days
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D]">Budget Level</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            >
              <option value="Budget-Friendly">Standard ($)</option>
              <option value="Moderate">Heritage Premium ($$)</option>
              <option value="Luxury & VIP">Royal VIP ($$$)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#C08C5D]">Group Type</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
            >
              <option value="Solo Traveler">Solo Traveler</option>
              <option value="Couple">Couple / Honeymoon</option>
              <option value="Family with Kids">Family with Kids</option>
              <option value="Friends Group">Friends Group</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#2C2621] bg-[#C08C5D] hover:bg-amber-500 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2C2621]" />
              {isLoading ? 'Creating...' : 'Curate Trip'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full border border-[#C08C5D] bg-[#2C2621] mx-auto flex items-center justify-center text-[#C08C5D] animate-spin">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#2C2621]">Barmawar AI Curating Your Expedition...</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Analyzing real-time routes, weather, authentic culinary spots, and prices in {currentCurrency} for {destination}...
          </p>
        </div>
      )}

      {/* Render Generated Itinerary */}
      {!isLoading && itinerary && (
        <div className="space-y-6 animate-fade-in">
          {/* Overview Header */}
          <div className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#2C2621] text-[#C08C5D] text-xs font-bold px-3 py-1 rounded-full border border-[#382F28] uppercase tracking-wider">
                  📍 {itinerary.destination}
                </span>
                <span className="bg-[#F5EFE6] text-[#2C2621] text-xs font-bold px-3 py-1 rounded-full border border-[#E8E2D9]">
                  🗓️ {itinerary.durationDays} Days / {itinerary.durationDays - 1} Nights
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2C2621]">{itinerary.tripOverview}</h3>
              <div className="flex flex-wrap gap-4 text-xs text-stone-600 pt-2">
                <span>💰 Cost Estimate: <strong className="text-[#2C2621]">{itinerary.totalEstimatedCost}</strong></span>
                <span>🌤️ Ideal Season: <strong className="text-[#C08C5D]">{itinerary.bestTimeToVisit}</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-[#F5EFE6] text-[#2C2621] border-[#E8E2D9]'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4 text-[#C08C5D]" />}
                {isSaved ? 'Itinerary Saved' : 'Save Itinerary'}
              </button>

              <button
                onClick={() =>
                  onBookAsPackage({
                    id: 'custom-' + Date.now(),
                    title: `Customized ${itinerary.durationDays}-Day ${itinerary.destination} Expedition`,
                    destination: itinerary.destination,
                    country: itinerary.destination,
                    durationDays: itinerary.durationDays,
                    durationNights: itinerary.durationDays - 1,
                    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
                    price: convertedPackagePrice.amount,
                    originalPrice: Math.round(convertedPackagePrice.amount * 1.3),
                    currency: convertedPackagePrice.symbol,
                    rating: 5.0,
                    inclusions: ['Luxury Stays & Daily Breakfast', 'Private Chauffeur', 'Guided Heritage Sightseeing', 'All Tolls & Fees'],
                    highlights: itinerary.days.map((d) => d.title),
                    itinerarySummary: itinerary.tripOverview,
                  })
                }
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#2C2621] bg-[#C08C5D] hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" /> Book Entire Package ({convertedPackagePrice.formatted})
              </button>
            </div>
          </div>

          {/* Day-by-Day Timeline */}
          <div className="space-y-4">
            <h4 className="text-xl font-serif font-bold text-[#2C2621] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C08C5D]" /> Day-by-Day Journey
            </h4>

            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#C08C5D] transition-colors">
                <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#2C2621] text-[#C08C5D] font-serif font-bold text-xs flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h5 className="font-serif font-bold text-[#2C2621] text-base">{day.title}</h5>
                      <p className="text-xs text-stone-500">{day.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Activity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {day.activities.map((act, idx) => (
                    <div key={idx} className="bg-white border border-[#E8E2D9] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                        <span className="flex items-center gap-1 text-[#C08C5D] font-bold">
                          <Clock className="w-3 h-3" /> {act.time}
                        </span>
                        <span className="text-[#2C2621] font-extrabold">{act.estimatedCost}</span>
                      </div>
                      <h6 className="font-serif font-bold text-[#2C2621] text-xs">{act.title}</h6>
                      <p className="text-[11px] text-stone-600 leading-snug">{act.description}</p>
                      {act.location && (
                        <p className="text-[10px] text-[#C08C5D] font-bold flex items-center gap-1 pt-1">
                          <MapPin className="w-3 h-3" /> {act.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Packing & Cuisine Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-5">
              <h5 className="font-serif font-bold text-[#2C2621] text-sm mb-3">🧳 Travel & Packing Essentials</h5>
              <ul className="space-y-2 text-xs text-stone-600">
                {itinerary.packingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C08C5D]"></span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-5">
              <h5 className="font-serif font-bold text-[#2C2621] text-sm mb-3">🍽️ Recommended Local Cuisine</h5>
              <ul className="space-y-2 text-xs text-stone-600">
                {itinerary.localCuisineToTry.map((food, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C08C5D]"></span> {food}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Google Search Grounding Sources */}
          {groundingSources.length > 0 && (
            <div className="bg-[#F9F6F1] border border-[#E8E2D9] rounded-2xl p-4 text-xs">
              <span className="font-serif font-bold text-[#2C2621] block mb-2">🌐 Live Verified Search Sources:</span>
              <div className="flex flex-wrap gap-2">
                {groundingSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-[#F5EFE6] text-[#2C2621] hover:text-[#C08C5D] px-2.5 py-1 rounded-lg border border-[#E8E2D9] flex items-center gap-1 transition-colors"
                  >
                    {source.title} <ExternalLink className="w-3 h-3 text-[#C08C5D]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
