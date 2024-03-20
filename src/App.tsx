import React, { useState } from 'react';
import { coinsData } from './mockData';

function App() {
  const [amount, setAmount] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value) || 0);
  };

  const calculateGains = (rate: number): number => {
    const monthlyRate = rate / 100;
    return amount * Math.pow(1 + monthlyRate, 12) - amount;
  };

  const calculateTotal = (rate: number): number => {
    return amount + calculateGains(rate);
  };

  const calculateCryptoQuantity = (price: number): number => {
    return amount / price;
    };

  return (
    <div className="App">
      <h1>Crypto Investment Calculator</h1>
      <input
        type="number"
        value={amount}
        onChange={handleInputChange}
        placeholder="Enter USD amount"
      />
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Cryptocurrency</th>
            <th>Annual Gain</th>
            <th>Total</th>
            <th>Quantity in Crypto</th>
          </tr>
        </thead>
        <tbody>
          {coinsData.map((coin) => {
            const gain = calculateGains(coin.rate);
            const total = calculateTotal(coin.rate);
            const cryptoQuantity = calculateCryptoQuantity(coin.price);
            return (
              <tr key={coin.id}>
                <td>
                  <img src={coin.logo_url} alt={`${coin.name} logo`} style={{ width: '50px' }} />
                </td>
                <td>{coin.name}</td>
                <td>${gain.toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
                <td>{cryptoQuantity.toFixed(4)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

