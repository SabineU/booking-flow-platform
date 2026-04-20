import { validatePostcode } from './validation';
import { describe, it, expect } from 'vitest';

describe('validatePostcode', () => {
  it('returns true for valid UK postcode SW1A 1AA', () => {
    expect(validatePostcode('SW1A 1AA')).toBe(true);
  });
  it('returns true for valid postcode with lowercase', () => {
    expect(validatePostcode('sw1a 1aa')).toBe(true);
  });
  it('returns false for invalid postcode', () => {
    expect(validatePostcode('12345')).toBe(false);
  });
  it('returns false for empty string', () => {
    expect(validatePostcode('')).toBe(false);
  });

  describe('validatePostcode edge cases', () => {
    it('should reject postcode with special characters', () => {
      expect(validatePostcode('SW1A!1AA')).toBe(false);
    });
    it('should reject postcode with extra spaces in wrong place', () => {
      expect(validatePostcode('SW1 A1AA')).toBe(false);
    });
    it('should accept postcode without space', () => {
      expect(validatePostcode('SW1A1AA')).toBe(true);
    });
    it('should accept postcode with multiple spaces between parts', () => {
      expect(validatePostcode('SW1A  1AA')).toBe(true);
    });
  });
});
