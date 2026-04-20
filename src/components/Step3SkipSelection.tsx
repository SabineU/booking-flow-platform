import { useEffect } from 'react';
import { useSkips } from '../hooks/useSkips';
import type { SkipOption } from '../hooks/useSkips';

interface Step3SkipSelectionProps {
  onNext: (data: { skipSize: string; price: number }) => void;
  initialData?: { skipSize?: string; price?: number };
  isHeavyWaste: boolean;
  postcode: string;
}

export function Step3SkipSelection({
  onNext,
  initialData,
  isHeavyWaste,
  postcode,
}: Step3SkipSelectionProps) {
  const { skips, loading, error, selectedSkip, setSelectedSkip, retry } = useSkips(
    postcode,
    isHeavyWaste
  );

  // Pre‑select the skip from initialData when skips load
  useEffect(() => {
    if (skips.length > 0 && initialData?.skipSize) {
      const matchingSkip = skips.find(
        (skip) => skip.size === initialData.skipSize && !skip.disabled
      );
      if (matchingSkip) {
        setSelectedSkip(matchingSkip);
      }
    }
  }, [skips, initialData, setSelectedSkip]);

  const handleSelect = (skip: SkipOption) => {
    if (skip.disabled) return;
    setSelectedSkip(skip);
  };

  const handleContinue = () => {
    if (!selectedSkip) return;
    onNext({ skipSize: selectedSkip.size, price: selectedSkip.price });
  };

  if (loading) {
    return (
      <div className="step3-skip-selection" data-testid="skip-loading">
        Loading skip options...
      </div>
    );
  }

  if (error) {
    return (
      <div className="step3-skip-selection">
        <div className="error" data-testid="skip-error">
          {error}
        </div>
        <button onClick={retry} data-testid="skip-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="step3-skip-selection">
      <h2>Select your skip size</h2>
      {isHeavyWaste && (
        <div className="info-message" data-testid="heavy-waste-warning">
          ⚠️ Heavy waste selected – smaller skips (2-yard, 4-yard) are disabled.
        </div>
      )}
      <div className="skip-grid" data-testid="skip-grid">
        {skips.map((skip) => (
          <button
            key={skip.size}
            className={`skip-card ${selectedSkip?.size === skip.size ? 'selected' : ''} ${
              skip.disabled ? 'disabled' : ''
            }`}
            onClick={() => handleSelect(skip)}
            disabled={skip.disabled}
            type="button"
            data-testid={`skip-${skip.size}`}
            data-disabled={skip.disabled}
          >
            <div className="skip-size">{skip.size}</div>
            <div className="skip-price">£{skip.price}</div>
          </button>
        ))}
      </div>
      <button onClick={handleContinue} disabled={!selectedSkip} data-testid="skip-continue">
        Continue
      </button>
    </div>
  );
}
