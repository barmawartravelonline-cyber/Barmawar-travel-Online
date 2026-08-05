import React from 'react';
import { Ticket, Printer, X, Compass } from 'lucide-react';
import { Booking } from '../types';

interface MyBookingsProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onOpenTicketVoucher: (booking: Booking) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenTicketVoucher,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1F1A16]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#1F1A16] text-[#FDFCF7] border border-[#C08C5D]/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2C2621] px-6 py-4 border-b border-[#382F28] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F1A16] border border-[#C08C5D]/40 flex items-center justify-center text-[#C08C5D] font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Booked Expeditions & E-Vouchers</h3>
              <p className="text-xs text-stone-400">Barmawar Travel Online • Syed Abdul Munyeem Barmawar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#382F28] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#1F1A16]">
          {bookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Compass className="w-12 h-12 text-[#C08C5D] mx-auto opacity-60" />
              <h4 className="font-serif font-bold text-white text-lg">No Booked Expeditions Found</h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Explore tour packages, flights, or Umrah packages and reserve your next voyage!
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#2C2621] border border-[#382F28] rounded-2xl p-5 hover:border-[#C08C5D] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                      {b.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#C08C5D]">PNR: {b.pnr}</span>
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">{b.itemTitle}</h4>
                  <p className="text-xs text-stone-400">
                    Traveler: <strong className="text-stone-200">{b.passengerName}</strong> • Date: <strong className="text-stone-200">{b.travelDate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#382F28] pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-serif font-black text-[#C08C5D]">
                      {b.currency}{b.totalAmount.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] text-stone-400 block uppercase">Fare Paid</span>
                  </div>

                  <button
                    onClick={() => onOpenTicketVoucher(b)}
                    className="px-4 py-2 rounded-xl bg-[#1F1A16] hover:bg-[#382F28] text-stone-200 text-xs font-bold border border-[#382F28] transition-all flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#C08C5D]" /> E-Voucher
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
