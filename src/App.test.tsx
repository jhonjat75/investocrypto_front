
import { calculateGains, calculateTotal, calculateCryptoQuantity } from './App.tsx';
jest.mock('./constants', () => ({
  VITE_API_URL: 'http://localhost:3000'
}));

describe('App calculations', () => {
  it('calculates gains correctly', () => {
    const rate = 10;
    const amount = 100;
    const expectedGains = amount * Math.pow(1 + rate / 100, 12) - amount;
    const gains = calculateGains(rate, amount);
    expect(gains).toBeCloseTo(expectedGains);
  });

  it('calculates total correctly', () => {
    const rate = 10;
    const amount = 100;
    const total = calculateTotal(rate, amount);
    const expectedTotal = amount + (amount * Math.pow(1 + rate / 100, 12) - amount);
    expect(total).toBeCloseTo(expectedTotal);
  });

  it('calculates crypto quantity correctly', () => {
    const price = 50;
    const amount = 100;
    const quantity = calculateCryptoQuantity(price, amount);
    const expectedQuantity = amount / price;
    expect(quantity).toBeCloseTo(expectedQuantity);
  });
});
