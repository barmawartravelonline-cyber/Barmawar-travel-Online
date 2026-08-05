export type SearchTab = 'flights' | 'hotels' | 'packages' | 'cabs' | 'ai-planner';

export interface FlightOption {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: number;
  currency: string;
  cabinClass: string;
  baggage: string;
  refundable: boolean;
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewsCount: number;
  stars: number;
  image: string;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  roomType: string;
  distanceFromCenter: string;
}

export interface PackageOption {
  id: string;
  title: string;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  image: string;
  price: number;
  originalPrice: number;
  currency: string;
  rating: number;
  inclusions: string[];
  highlights: string[];
  tag?: string;
  itinerarySummary: string;
}

export interface CabOption {
  id: string;
  category: 'Sedan' | 'SUV' | 'Luxury' | 'Hatchback' | 'SUV / Umrah Package' | 'Umrah Package' | string;
  carModel: string;
  passengers: number;
  luggageCount: number;
  pricePerKm: number;
  estimatedPrice: number;
  currency: string;
  image: string;
  features: string[];
}

export interface ActivityItem {
  time: string;
  title: string;
  description: string;
  location?: string;
  estimatedCost?: string;
  category: 'sightseeing' | 'food' | 'transport' | 'leisure' | 'stay';
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  summary: string;
  activities: ActivityItem[];
}

export interface GeneratedItinerary {
  destination: string;
  durationDays: number;
  totalEstimatedCost: string;
  bestTimeToVisit: string;
  tripOverview: string;
  days: DayItinerary[];
  packingTips: string[];
  localCuisineToTry: string[];
  groundingSources?: { title: string; url: string }[];
}

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'package' | 'cab';
  pnr: string;
  itemTitle: string;
  subtitle: string;
  details: Record<string, string>;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalAmount: number;
  currency: string;
  bookingDate: string;
  travelDate: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod: string;
  qrData?: string;
}

export interface TranscriptMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface LiveToolCall {
  name: string;
  args: any;
  result?: any;
}
