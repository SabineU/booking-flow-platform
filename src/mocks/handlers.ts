import { http, HttpResponse, delay } from 'msw';

// Helper to generate 12+ addresses for SW1A 1AA
const generateManyAddresses = () => {
  const addresses = [];
  for (let i = 1; i <= 14; i++) {
    addresses.push({
      id: `addr_${i}`,
      line1: `${i} ${i <= 10 ? 'Downing Street' : 'Whitehall'}`,
      city: 'London',
    });
  }
  return addresses;
};

// Store call count for BS1 4DJ retry logic
let bs1CallCount = 0;

export const handlers = [
  // Postcode lookup
  http.post('/api/postcode/lookup', async ({ request }) => {
    const body = (await request.json()) as { postcode: string };
    const postcode = body.postcode.toUpperCase();

    // Simulate latency for M1 1AE
    if (postcode === 'M1 1AE') {
      await delay(2000);
    }

    // BS1 4DJ: first call 500 error, second call success
    if (postcode === 'BS1 4DJ') {
      bs1CallCount++;
      if (bs1CallCount === 1) {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      } else {
        // Reset counter after success? Not necessary for assessment, but fine.
        return HttpResponse.json({
          postcode: 'BS1 4DJ',
          addresses: [{ id: 'addr_1', line1: '1 Temple Way', city: 'Bristol' }],
        });
      }
    }

    // SW1A 1AA: 12+ addresses
    if (postcode === 'SW1A 1AA') {
      return HttpResponse.json({
        postcode: 'SW1A 1AA',
        addresses: generateManyAddresses(),
      });
    }

    // EC1A 1BB: 0 addresses
    if (postcode === 'EC1A 1BB') {
      return HttpResponse.json({
        postcode: 'EC1A 1BB',
        addresses: [],
      });
    }

    // Default: return 2 generic addresses
    return HttpResponse.json({
      postcode,
      addresses: [
        { id: 'default_1', line1: '123 High Street', city: 'London' },
        { id: 'default_2', line1: '456 Main Road', city: 'London' },
      ],
    });
  }),

  // Waste types (simple mock – always ok)
  http.post('/api/waste-types', async () => {
    return HttpResponse.json({ ok: true });
  }),

  // Get skips
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

    // Heavy waste disables at least 2 skip sizes (2-yard and 4-yard)
    const skips = allSkips.map((skip) => ({
      ...skip,
      disabled: heavyWaste ? skip.size === '2-yard' || skip.size === '4-yard' : skip.disabled,
    }));

    return HttpResponse.json({ skips });
  }),

  /*
  // Confirm booking
  http.post('/api/booking/confirm', async ({ request }) => {
    const body = await request.json();
    console.log('Booking confirmed:', body);
    return HttpResponse.json({ status: 'success', bookingId: 'BK-' + Math.floor(Math.random() * 100000) });
  }),*/

  // Confirm booking – supports optional delay via query param for testing
  http.post('/api/booking/confirm', async ({ request }) => {
    const url = new URL(request.url);
    const delayMs = url.searchParams.get('delay');
    if (delayMs) {
      await delay(parseInt(delayMs, 10));
    }

    const body = await request.json();
    console.log('Booking confirmed:', body);
    return HttpResponse.json({
      status: 'success',
      bookingId: 'BK-' + Math.floor(Math.random() * 100000),
    });
  }),
];
