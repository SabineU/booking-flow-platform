import { useState, useRef } from 'react';

interface BookingData {
  postcode: string;
  addressId?: string;
  heavyWaste: boolean;
  plasterboard: boolean;
  skipSize: string;
  price: number;
}

interface UseConfirmBookingReturn {
  isConfirming: boolean;
  error: string;
  confirmBooking: (data: BookingData) => Promise<{ success: boolean; bookingId?: string }>;
  reset: () => void;
}

export function useConfirmBooking(): UseConfirmBookingReturn {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const isConfirmingRef = useRef(false);

  const confirmBooking = async (data: BookingData) => {
    // Prevent double submission using a synchronous lock
    if (isConfirmingRef.current) {
      return { success: false };
    }

    isConfirmingRef.current = true;
    setIsConfirming(true);
    setError('');

    try {
      const response = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const result = await response.json();
      return { success: true, bookingId: result.bookingId };
    } catch (err) {
      setError('Failed to confirm booking. Please try again.');
      console.error(err);
      return { success: false };
    } finally {
      setIsConfirming(false);
      // Note: We don't reset the ref on error because we want to prevent further attempts until user retries.
      // Other Option: We might want to unlock after a delay or provide a retry button.
    }
  };

  const reset = () => {
    isConfirmingRef.current = false;
    setIsConfirming(false);
    setError('');
  };

  return {
    isConfirming,
    error,
    confirmBooking,
    reset,
  };
}
