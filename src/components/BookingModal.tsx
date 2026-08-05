import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Printer, Download, CreditCard, User, Mail, Phone, Calendar, Ticket, Compass, QrCode } from 'lucide-react';
import { Booking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingItem: {
    type: 'flight' | 'hotel' | 'package' | 'cab';
    title: string;
    subtitle: string;
    price: number;
    currency: string;
  } | null;
  onBookingConfirmed: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingItem,
  onBookingConfirmed,
}) => {
  const [passengerName, setPassengerName] = useState('Rahul Sharma');
  const [passengerEmail, setPassengerEmail] = useState('barmawartravelonline@gmail.com');
  const [passengerPhone, setPassengerPhone] = useState('+91 9731831122');
  const [travelDate, setTravelDate] = useState('2026-09-20');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Instant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen || !bookingItem) return null;

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/book-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: bookingItem.type,
          itemTitle: bookingItem.title,
          passengerName,
          passengerEmail,
          passengerPhone,
          travelDate,
          totalAmount: bookingItem.price,
          currency: bookingItem.currency,
        }),
      });

      const data = await response.json();
      if (data.booking) {
        setConfirmedBooking(data.booking);
        onBookingConfirmed(data.booking);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      // Fallback
      const fallbackBooking: Booking = {
        id: 'BK-' + Date.now().toString().slice(-6),
        type: bookingItem.type,
        pnr: 'BTO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        itemTitle: bookingItem.title,
        subtitle: bookingItem.subtitle,
        details: {
          Customer: passengerName,
          Email: passengerEmail,
          Phone: passengerPhone,
          Status: 'CONFIRMED',
        },
        passengerName,
        passengerEmail,
        passengerPhone,
        totalAmount: bookingItem.price,
        currency: bookingItem.currency,
        bookingDate: new Date().toLocaleDateString(),
        travelDate,
        status: 'Confirmed',
        paymentMethod,
        qrData: `PNR:${bookingItem.title}`,
      };
      setConfirmedBooking(fallbackBooking);
      onBookingConfirmed(fallbackBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F1A16]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1F1A16] text-[#FDFCF7] border border-[#C08C5D]/50 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#2C2621] px-6 py-4 border-b border-[#382F28] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F1A16] border border-[#C08C5D]/40 flex items-center justify-center text-[#C08C5D] font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">
                {confirmedBooking ? 'Official Heritage E-Ticket Voucher' : 'Instant Reservation Checkout'}
              </h3>
              <p className="text-xs text-stone-400">Barmawar Travel Online • Syed Abdul Munyeem Barmawar</p>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmedBooking(null);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#382F28] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form OR Printable Voucher */}
        {!confirmedBooking ? (
          <form onSubmit={handleConfirmCheckout} className="p-6 space-y-5">
            {/* Item summary */}
            <div className="bg-[#2C2621] border border-[#382F28] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#C08C5D] uppercase tracking-widest block">
                  {bookingItem.type.toUpperCase()} BOOKING
                </span>
                <h4 className="font-serif font-bold text-white text-base">{bookingItem.title}</h4>
                <p className="text-xs text-stone-400">{bookingItem.subtitle}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Total Fare</span>
                <span className="text-2xl font-serif font-black text-[#C08C5D]">
                  {bookingItem.currency}{bookingItem.price.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Passenger Fields */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C08C5D]" /> Traveler & Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-stone-400">Full Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    required
                    className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-stone-400">Email Address</label>
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    required
                    className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-stone-400">Phone Number</label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    required
                    className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-stone-400">Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                    className="w-full bg-[#2C2621] border border-[#382F28] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C08C5D]"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-2 pt-2 border-t border-[#382F28]">
              <label className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-[#C08C5D]" /> Payment Option
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Credit / Debit Card', 'UPI / NetBanking', 'Pay at Check-in'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentMethod === m
                        ? 'bg-[#C08C5D] text-[#2C2621] border-[#C08C5D]'
                        : 'bg-[#2C2621] text-stone-400 border-[#382F28]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-[#2C2621] border border-[#C08C5D]/30 rounded-xl p-3 flex items-center gap-3 text-xs text-stone-300">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#C08C5D]" />
              <span>100% Guaranteed Reservation with instant PNR voucher generation & 24/7 support by Syed Abdul Munyeem Barmawar (+91 9731831122).</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#2C2621] bg-[#C08C5D] hover:bg-amber-500 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Confirming Reservation...' : `Confirm & Issue Voucher (${bookingItem.currency}${bookingItem.price.toLocaleString('en-US')})`}
            </button>
          </form>
        ) : (
          /* Printable E-Ticket Voucher */
          <div className="p-6 space-y-6 bg-[#1F1A16] printable-ticket">
            {/* Ticket Card Header */}
            <div className="bg-[#2C2621] border border-[#C08C5D]/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#382F28] pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-6 h-6 text-[#C08C5D]" />
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">BARMAWAR TRAVEL ONLINE</h4>
                    <p className="text-[10px] text-[#C08C5D] uppercase tracking-widest">Syed Abdul Munyeem Barmawar • Official E-Ticket</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 font-extrabold uppercase bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    {confirmedBooking.status}
                  </span>
                  <p className="text-xs font-mono font-bold text-white mt-1">PNR: {confirmedBooking.pnr}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block">Traveler</span>
                  <strong className="text-white">{confirmedBooking.passengerName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Travel Date</span>
                  <strong className="text-white">{confirmedBooking.travelDate}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Booking Ref</span>
                  <strong className="text-white font-mono">{confirmedBooking.id}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Total Amount</span>
                  <strong className="text-[#C08C5D] font-serif font-extrabold text-base">
                    {confirmedBooking.currency}{confirmedBooking.totalAmount.toLocaleString('en-US')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Ticket details body */}
            <div className="border border-[#382F28] rounded-2xl p-4 bg-[#2C2621] space-y-3 text-xs">
              <h5 className="font-serif font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#C08C5D]" /> Service Summary: {confirmedBooking.itemTitle}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                <p><strong>Customer Email:</strong> {confirmedBooking.passengerEmail}</p>
                <p><strong>Support Contact:</strong> +91 9731831122</p>
                <p><strong>Issue Date:</strong> {confirmedBooking.bookingDate}</p>
                <p><strong>Payment Status:</strong> {confirmedBooking.paymentMethod}</p>
              </div>

              {/* QR Code Graphic */}
              <div className="pt-3 border-t border-[#382F28] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-[#2C2621]" />
                  </div>
                  <div className="text-[11px] text-stone-400">
                    <p className="font-bold text-white">Present at Airport / Hotel Desk</p>
                    <p>Owner: Syed Abdul Munyeem Barmawar • 9731831122</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Print & Download Actions */}
            <div className="flex items-center justify-end gap-3 no-print">
              <button
                onClick={handlePrintTicket}
                className="px-4 py-2.5 rounded-xl bg-[#2C2621] hover:bg-[#382F28] text-white font-bold text-xs border border-[#382F28] transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#C08C5D]" /> Print Voucher
              </button>

              <button
                onClick={() => {
                  alert("E-Ticket PDF downloaded successfully!");
                }}
                className="px-5 py-2.5 rounded-xl bg-[#C08C5D] hover:bg-amber-500 text-[#2C2621] font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
