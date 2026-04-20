import { useState } from 'react';
import { validatePostcode } from '../utils/validation';

export interface Address {
  id: string;
  line1: string;
  city: string;
}

interface UsePostcodeLookupReturn {
  postcode: string;
  setPostcode: (value: string) => void;
  loading: boolean;
  error: string;
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  handleLookup: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

export function usePostcodeLookup(): UsePostcodeLookupReturn {
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const reset = () => {
    setAddresses([]);
    setSelectedAddress(null);
    setError('');
  };

  const handleLookup = async () => {
    // Validate postcode format
    if (!validatePostcode(postcode)) {
      setError('Invalid UK postcode');
      return;
    }

    setError('');
    setLoading(true);
    reset();

    try {
      const response = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: postcode.trim().toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.addresses && data.addresses.length === 0) {
        setError('No addresses found for this postcode');
      } else {
        setAddresses(data.addresses);
      }
    } catch (err) {
      setError('Failed to fetch addresses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const retry = async () => {
    await handleLookup();
  };

  return {
    postcode,
    setPostcode,
    loading,
    error,
    addresses,
    selectedAddress,
    setSelectedAddress,
    handleLookup,
    retry,
    reset,
  };
}
