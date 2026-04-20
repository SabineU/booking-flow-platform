import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step1Postcode } from './Step1Postcode';
import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.post('/api/postcode/lookup', async () => {
    return HttpResponse.json({
      postcode: 'SW1A 1AA',
      addresses: [{ id: '1', line1: '10 Downing Street', city: 'London' }],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Step1Postcode', () => {
  it('shows error for invalid postcode', async () => {
    const onNext = vi.fn();
    render(<Step1Postcode onNext={onNext} />);
    const input = screen.getByLabelText(/postcode/i);
    await userEvent.type(input, '123');
    const button = screen.getByRole('button', { name: /find address/i });
    await userEvent.click(button);
    expect(await screen.findByText(/invalid uk postcode/i)).toBeInTheDocument();
  });

  it('fetches addresses for valid postcode and allows selection', async () => {
    const onNext = vi.fn();
    render(<Step1Postcode onNext={onNext} />);
    const input = screen.getByLabelText(/postcode/i);
    await userEvent.type(input, 'SW1A 1AA');
    const button = screen.getByRole('button', { name: /find address/i });
    await userEvent.click(button);

    expect(await screen.findByText(/10 Downing Street/i)).toBeInTheDocument();
    const radio = screen.getByRole('radio', { name: /10 Downing Street/i });
    await userEvent.click(radio);
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    await userEvent.click(continueBtn);
    expect(onNext).toHaveBeenCalledWith({
      postcode: 'SW1A 1AA',
      address: { id: '1', line1: '10 Downing Street', city: 'London' },
      manualAddress: null,
    });
  });
});
