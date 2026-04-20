import { useState, useEffect } from 'react';

export interface SkipOption {
  size: string;
  price: number;
  disabled: boolean;
}

interface UseSkipsReturn {
  skips: SkipOption[];
  loading: boolean;
  error: string;
  selectedSkip: SkipOption | null;
  setSelectedSkip: (skip: SkipOption | null) => void;
  retry: () => void;
}

export function useSkips(postcode: string, isHeavyWaste: boolean): UseSkipsReturn {
  const [skips, setSkips] = useState<SkipOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSkip, setSelectedSkip] = useState<SkipOption | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const retry = () => setRetryTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!postcode) return;

    const fetchSkips = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `/api/skips?postcode=${encodeURIComponent(postcode)}&heavyWaste=${isHeavyWaste}`
        );
        if (!response.ok) throw new Error('Failed to load skips');
        const data = await response.json();
        setSkips(data.skips);
      } catch (err) {
        setError('Could not load skip options. Please refresh.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkips();
  }, [postcode, isHeavyWaste, retryTrigger]);

  return {
    skips,
    loading,
    error,
    selectedSkip,
    setSelectedSkip,
    retry,
  };
}
