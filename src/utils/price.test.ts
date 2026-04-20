import { calculateTotalPrice } from './price';
import { describe, it, expect } from 'vitest';

describe('calculateTotalPrice', () => {
  it('returns base price for general waste', () => {
    expect(calculateTotalPrice(100, 'general')).toBe(100);
  });
  it('adds £30 for heavy waste', () => {
    expect(calculateTotalPrice(100, 'heavy')).toBe(130);
  });
  it('adds £20 for plasterboard', () => {
    expect(calculateTotalPrice(100, 'plasterboard')).toBe(120);
  });
  it('adds only £20 even if plasterboard option is provided', () => {
    expect(calculateTotalPrice(100, 'plasterboard', 'recycle')).toBe(120);
  });
});
