import { renderHook, act, waitFor } from '@testing-library/react';
import { usePostcodeLookup } from './usePostcodeLookup';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';

const server = setupServer(
  http.post('/api/postcode/lookup', async ({ request }) => {
    const body = (await request.json()) as { postcode: string };
    const postcode = body.postcode.toUpperCase();

    // Use valid-format postcodes that trigger different responses
    if (postcode === 'AA1 1AA') {
      // Simulate server error (500)
      return new HttpResponse(null, { status: 500 });
    }
    if (postcode === 'BB1 1BB') {
      // Simulate empty address list
      return HttpResponse.json({ postcode: 'BB1 1BB', addresses: [] });
    }
    // Default: return one address
    return HttpResponse.json({
      postcode,
      addresses: [{ id: '1', line1: 'Test Street', city: 'Test City' }],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('usePostcodeLookup', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => usePostcodeLookup());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.addresses).toEqual([]);
  });

  it('should validate postcode format', async () => {
    const { result } = renderHook(() => usePostcodeLookup());
    act(() => {
      result.current.setPostcode('123'); // invalid
    });
    await act(async () => {
      await result.current.handleLookup();
    });
    expect(result.current.error).toBe('Invalid UK postcode');
  });

  it('should fetch addresses for valid postcode', async () => {
    const { result } = renderHook(() => usePostcodeLookup());
    act(() => {
      result.current.setPostcode('SW1A 1AA'); // any valid format not special-cased
    });
    await act(async () => {
      await result.current.handleLookup();
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.addresses).toHaveLength(1);
    });
  });

  it('should handle empty address list', async () => {
    const { result } = renderHook(() => usePostcodeLookup());
    act(() => {
      result.current.setPostcode('BB1 1BB'); // triggers empty list
    });
    await act(async () => {
      await result.current.handleLookup();
    });
    await waitFor(() => {
      expect(result.current.error).toBe('No addresses found for this postcode');
    });
  });

  it('should handle server error', async () => {
    const { result } = renderHook(() => usePostcodeLookup());
    act(() => {
      result.current.setPostcode('AA1 1AA'); // triggers 500
    });
    await act(async () => {
      await result.current.handleLookup();
    });
    await waitFor(() => {
      expect(result.current.error).toContain('Failed to fetch addresses');
    });
  });

  it('should retry on error', async () => {
    const { result } = renderHook(() => usePostcodeLookup());
    act(() => {
      result.current.setPostcode('AA1 1AA'); // will fail first
    });
    await act(async () => {
      await result.current.handleLookup();
    });
    expect(result.current.error).toContain('Failed');

    // Change server response to success for retry
    server.use(
      http.post('/api/postcode/lookup', () => {
        return HttpResponse.json({
          postcode: 'AA1 1AA',
          addresses: [{ id: '2', line1: 'Fixed', city: 'City' }],
        });
      })
    );

    await act(async () => {
      await result.current.retry();
    });
    await waitFor(() => {
      expect(result.current.addresses).toHaveLength(1);
      expect(result.current.error).toBe('');
    });
  });
});
