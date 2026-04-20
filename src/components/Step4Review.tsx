import { useState } from 'react';
import { calculateTotalPrice } from '../utils/price';
import { useConfirmBooking } from '../hooks/useConfirmBooking';

interface Step4ReviewProps {
  data: {
    postcode: string;
    address: { id: string; line1: string; city: string } | null;
    manualAddress: string | null;
    wasteType: string;
    plasterboardOption?: string;
    skipSize: string;
    price: number;
  };
  onConfirm: () => void;
}

export function Step4Review({ data, onConfirm }: Step4ReviewProps) {
  const [confirmed, setConfirmed] = useState(false);
  const { isConfirming, error, confirmBooking } = useConfirmBooking();

  const heavyWasteFee = data.wasteType === 'heavy' ? 30 : 0;
  const plasterboardFee = data.wasteType === 'plasterboard' ? 20 : 0;
  const totalPrice = calculateTotalPrice(data.price, data.wasteType, data.plasterboardOption);

  const addressDisplay = data.address
    ? `${data.address.line1}, ${data.address.city}`
    : data.manualAddress;

  const wasteTypeDisplay =
    data.wasteType === 'plasterboard' && data.plasterboardOption
      ? `Plasterboard (${data.plasterboardOption})`
      : data.wasteType === 'heavy'
        ? 'Heavy waste'
        : 'General waste';

  const handleConfirm = async () => {
    const result = await confirmBooking({
      postcode: data.postcode,
      addressId: data.address?.id,
      heavyWaste: data.wasteType === 'heavy',
      plasterboard: data.wasteType === 'plasterboard',
      skipSize: data.skipSize,
      price: totalPrice,
    });

    if (result.success) {
      setConfirmed(true);
      onConfirm();
    }
  };

  if (confirmed) {
    return (
      <div className="step4-review">
        <h2>Booking confirmed! 🎉</h2>
        <p>Your skip has been booked. We'll send you a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div className="step4-review">
      <h2>Review your booking</h2>

      <div className="review-section">
        <h3>Delivery address</h3>
        <p data-testid="review-address">{addressDisplay}</p>
        <p className="postcode" data-testid="review-postcode">
          {data.postcode}
        </p>
      </div>

      <div className="review-section">
        <h3>Waste type</h3>
        <p data-testid="review-waste-type">{wasteTypeDisplay}</p>
      </div>

      <div className="review-section">
        <h3>Skip size</h3>
        <p data-testid="review-skip-size">{data.skipSize}</p>
      </div>

      <div className="review-section price-breakdown" data-testid="price-breakdown">
        <h3>Price breakdown</h3>
        <div className="price-row">
          <span>Skip hire ({data.skipSize})</span>
          <span>£{data.price}</span>
        </div>
        {heavyWasteFee > 0 && (
          <div className="price-row" data-testid="heavy-surcharge">
            <span>Heavy waste surcharge</span>
            <span>£{heavyWasteFee}</span>
          </div>
        )}
        {plasterboardFee > 0 && (
          <div className="price-row" data-testid="plasterboard-fee">
            <span>Plasterboard handling</span>
            <span>£{plasterboardFee}</span>
          </div>
        )}
        <div className="price-row total" data-testid="total-price">
          <span>Total</span>
          <span>£{totalPrice}</span>
        </div>
      </div>

      {error && (
        <div className="error" data-testid="confirm-error">
          {error}
        </div>
      )}

      <button onClick={handleConfirm} disabled={isConfirming} data-testid="confirm-button">
        {isConfirming ? 'Processing...' : 'Confirm booking'}
      </button>
    </div>
  );
}
