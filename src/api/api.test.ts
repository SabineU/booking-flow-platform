import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';

// Mock API handlers – identical to those used in the browser
const handlers = [
  http.post('/api/postcode/lookup', async ({ request }) => {
    const body = (await request.json()) as { postcode: string };
    const postcode = body.postcode.toUpperCase();

    if (postcode === 'M1 1AE') {
      await delay(2000);
    }

    if (postcode === 'BS1 4DJ') {
      // Use a module-level variable to track calls across tests
      // For simplicity, we'll rely on the test's own sequencing
      if (!bs1CallCount) {
        bs1CallCount = 1;
        return new HttpResponse(null, { status: 500 });
      }
      bs1CallCount = 0;
      return HttpResponse.json({
        postcode: 'BS1 4DJ',
        addresses: [{ id: 'addr_1', line1: '1 Temple Way', city: 'Bristol' }],
      });
    }

    if (postcode === 'SW1A 1AA') {
      const addresses = Array.from({ length: 14 }, (_, i) => ({
        id: `addr_${i + 1}`,
        line1: `${i + 1} ${i < 10 ? 'Downing Street' : 'Whitehall'}`,
        city: 'London',
      }));
      return HttpResponse.json({ postcode: 'SW1A 1AA', addresses });
    }

    if (postcode === 'EC1A 1BB') {
      return HttpResponse.json({ postcode: 'EC1A 1BB', addresses: [] });
    }

    return HttpResponse.json({
      postcode,
      addresses: [{ id: 'default_1', line1: '123 High Street', city: 'London' }],
    });
  }),

  http.post('/api/waste-types', async () => {
    return HttpResponse.json({ ok: true });
  }),

  http.get('/api/skips', ({ request }) => {
    const url = new URL(request.url);
    const heavyWaste = url.searchParams.get('heavyWaste') === 'true';

    const allSkips = [
      { size: '2-yard', price: 80, disabled: false },
      { size: '4-yard', price: 120, disabled: false },
      { size: '6-yard', price: 160, disabled: false },
      { size: '8-yard', price: 200, disabled: false },
      { size: '10-yard', price: 240, disabled: false },
      { size: '12-yard', price: 280, disabled: false },
      { size: '14-yard', price: 320, disabled: false },
      { size: '16-yard', price: 360, disabled: false },
    ];

    const skips = allSkips.map((skip) => ({
      ...skip,
      disabled: heavyWaste ? skip.size === '2-yard' || skip.size === '4-yard' : skip.disabled,
    }));

    return HttpResponse.json({ skips });
  }),

  http.post('/api/booking/confirm', async ({ request }) => {
    const body = await request.json();
    console.log('Booking confirmed:', body);
    return HttpResponse.json({
      status: 'success',
      bookingId: `BK-${Math.floor(Math.random() * 100000)}`,
    });
  }),
];

// Global variable to simulate BS1 4DJ call count
let bs1CallCount = 0;

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  bs1CallCount = 0; // Reset counter between tests
});
afterAll(() => server.close());

describe('API Contract Tests (Vitest + MSW)', () => {
  describe('POST /api/postcode/lookup', () => {
    it('should return 14 addresses for SW1A 1AA (richness gate)', async () => {
      const response = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: 'SW1A 1AA' }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.postcode).toBe('SW1A 1AA');
      expect(body.addresses).toHaveLength(14);
    });

    it('should return 0 addresses for EC1A 1BB (empty state)', async () => {
      const response = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: 'EC1A 1BB' }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.addresses).toHaveLength(0);
    });

    it('should simulate latency for M1 1AE', async () => {
      const start = Date.now();
      const response = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: 'M1 1AE' }),
      });
      const duration = Date.now() - start;
      expect(response.status).toBe(200);
      expect(duration).toBeGreaterThanOrEqual(1900);
    });

    it('should return 500 on first call for BS1 4DJ, then success on second call', async () => {
      // First call – 500
      const response1 = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: 'BS1 4DJ' }),
      });
      expect(response1.status).toBe(500);

      // Second call – 200
      const response2 = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: 'BS1 4DJ' }),
      });
      expect(response2.status).toBe(200);
      const body = await response2.json();
      expect(body.addresses).toHaveLength(1);
    });

    it('should return addresses for a generic valid postcode', async () => {
      const response = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: 'W1A 1AA' }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.addresses.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/waste-types', () => {
    it('should accept heavy waste selection', async () => {
      const response = await fetch('/api/waste-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heavyWaste: true, plasterboard: false, plasterboardOption: null }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.ok).toBe(true);
    });

    it('should accept plasterboard with handling option', async () => {
      const response = await fetch('/api/waste-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heavyWaste: false,
          plasterboard: true,
          plasterboardOption: 'recycle',
        }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.ok).toBe(true);
    });
  });

  describe('GET /api/skips', () => {
    it('should return 8 skip options for general waste', async () => {
      const response = await fetch('/api/skips?postcode=SW1A1AA&heavyWaste=false');
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.skips).toHaveLength(8);
      body.skips.forEach((skip: any) => {
        expect(skip.disabled).toBe(false);
      });
    });

    it('should disable 2-yard and 4-yard skips for heavy waste', async () => {
      const response = await fetch('/api/skips?postcode=SW1A1AA&heavyWaste=true');
      expect(response.status).toBe(200);
      const body = await response.json();
      const twoYard = body.skips.find((s: any) => s.size === '2-yard');
      const fourYard = body.skips.find((s: any) => s.size === '4-yard');
      expect(twoYard.disabled).toBe(true);
      expect(fourYard.disabled).toBe(true);
      const disabledCount = body.skips.filter((s: any) => s.disabled).length;
      expect(disabledCount).toBeGreaterThanOrEqual(2);
    });

    it('should return skips with price and size properties', async () => {
      const response = await fetch('/api/skips?postcode=SW1A1AA&heavyWaste=false');
      const body = await response.json();
      expect(body.skips[0]).toHaveProperty('size');
      expect(body.skips[0]).toHaveProperty('price');
      expect(body.skips[0]).toHaveProperty('disabled');
    });
  });

  describe('POST /api/booking/confirm', () => {
    it('should confirm booking and return success with bookingId', async () => {
      const response = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postcode: 'SW1A 1AA',
          addressId: 'addr_1',
          heavyWaste: true,
          plasterboard: false,
          skipSize: '4-yard',
          price: 120,
        }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.bookingId).toMatch(/^BK-\d+$/);
    });
  });
});
