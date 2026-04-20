import { useState } from 'react';
import { usePostcodeLookup } from '../hooks/usePostcodeLookup';
import type { Address } from '../hooks/usePostcodeLookup';

interface Step1PostcodeProps {
  onNext: (data: {
    postcode: string;
    address: Address | null;
    manualAddress: string | null;
  }) => void;
}

export function Step1Postcode({ onNext }: Step1PostcodeProps) {
  const {
    postcode,
    setPostcode,
    loading,
    error,
    addresses,
    selectedAddress,
    setSelectedAddress,
    handleLookup,
    retry,
  } = usePostcodeLookup();

  const [useManual, setUseManual] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setUseManual(false);
  };

  const handleContinue = () => {
    if (useManual) {
      if (!manualAddress.trim()) {
        setValidationError('Please enter a manual address');
        return;
      }
      setValidationError('');
      onNext({ postcode, address: null, manualAddress });
    } else {
      if (!selectedAddress) {
        setValidationError('Please select an address');
        return;
      }
      setValidationError('');
      onNext({ postcode, address: selectedAddress, manualAddress: null });
    }
  };

  return (
    <div className="step1-postcode">
      <h2>Enter your postcode</h2>
      <div>
        <input
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          placeholder="e.g. SW1A 1AA"
          aria-label="Postcode"
          data-testid="postcode-input"
        />
        <button onClick={handleLookup} disabled={loading} data-testid="find-address-button">
          {loading ? 'Looking up...' : 'Find Address'}
        </button>
      </div>

      {error && (
        <div className="error" data-testid="postcode-error">
          {error}
          {error.includes('Failed to fetch') && (
            <button onClick={retry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      )}

      {!useManual && addresses.length > 0 && (
        <div>
          <h3>Select your address</h3>
          <ul data-testid="address-list">
            {addresses.map((addr) => (
              <li key={addr.id}>
                <label>
                  <input
                    type="radio"
                    name="address"
                    onChange={() => handleAddressSelect(addr)}
                    checked={selectedAddress?.id === addr.id}
                    data-testid={`address-${addr.id}`}
                  />
                  {addr.line1}, {addr.city}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={() => setUseManual(true)} data-testid="manual-entry-button">
            Enter address manually
          </button>
        </div>
      )}

      {useManual && (
        <div>
          <h3>Enter your address manually</h3>
          <textarea
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Full address"
            rows={3}
            data-testid="manual-address-input"
          />
          <button onClick={() => setUseManual(false)} data-testid="back-to-address-list">
            Back to address list
          </button>
        </div>
      )}

      {validationError && <div className="error">{validationError}</div>}

      {(selectedAddress || (useManual && manualAddress)) && (
        <button onClick={handleContinue} data-testid="postcode-continue">
          Continue
        </button>
      )}
    </div>
  );
}
